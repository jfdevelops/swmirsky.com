import { createServerFn } from '@tanstack/react-start';
import { type } from 'arktype';
import { getJson } from 'serpapi';
import { DevtoolsApiRefetchEventClient } from './event-client';
import {
  getCachedBlob,
  invalidateCachedBlobs,
  setCachedBlob,
} from './netlify-blob';

export type SearchResult = {
  title: string;
  link: string;
  thumbnails: string[];
  rating: number;
  reviews: number;
  price: number;
};
export type SearchSerpApiInput = typeof searchSerpApiSchema.infer;

const AsinScope = type.scope({
  asins: 'string[]',
});
export const searchSerpApiSchema = AsinScope.type({ asins: 'asins' });
export const searchSerpApi = createServerFn({ method: 'GET' })
  .inputValidator(searchSerpApiSchema)
  .handler(async ({ data }) => {
    let results: Record<string, SearchResult> = {};
    const missingKeys: string[] = [];

    // Check cache for all requested ASINs
    for (const key of data.asins) {
      const blobKey = `data:${key}`;
      try {
        const cached = await getCachedBlob<SearchResult>(blobKey);

        if (cached) {
          results[key] = cached;
        } else {
          missingKeys.push(key);
        }
      } catch (error) {
        // If cache read fails, fetch fresh data
        console.error(`Failed to read cache for ${key}:`, error);
        missingKeys.push(key);
      }
    }

    results = await fetchAsinData(missingKeys);

    console.log('results', results);

    return results;
  });

export const invalidateAsinCache = createServerFn({ method: 'POST' })
  .inputValidator(searchSerpApiSchema)
  .handler(async ({ data }) => {
    const keys = data.asins.map((asin) => `data:${asin}`);

    await invalidateCachedBlobs(keys);

    // Fetch fresh data immediately after invalidation
    const freshData = await fetchAsinData(data.asins);

    // Emit event to devtools with the fresh data
    try {
      DevtoolsApiRefetchEventClient.emit('asin-cache-invalidator', {
        asinData: freshData,
      });
    } catch (error) {
      // Don't fail if devtools event fails
      console.error('Failed to emit devtools event:', error);
    }

    return {
      success: true,
      invalidated: keys.length,
      freshData,
    };
  });

async function getProductData(asin: string): Promise<SearchResult> {
  try {
    const json = await getJson({
      api_key: process.env.SERPAPI_KEY,
      engine: 'amazon_product',
      asin,
    });

    // Validate API response structure
    if (!json?.product_results) {
      console.error(`Invalid API response for ASIN ${asin}:`, json);
    }

    const price = json.prices[0].extracted_price;

    return {
      title: json.product_results.title as string,
      link: '',
      thumbnails: (json.product_results.thumbnails as string[]) || [],
      rating: (json.product_results.rating as number) || 0,
      reviews: (json.product_results.reviews as number) || 0,
      price,
    };
  } catch (error) {
    // Log error but don't fail the entire request
    console.error(`Failed to fetch data for ASIN ${asin}:`, error);

    return {
      title: '',
      link: '',
      thumbnails: [],
      rating: 0,
      reviews: 0,
      price: 0,
    };
  }
}

async function getProductLink(asin: string): Promise<string> {
  try {
    const json = await getJson({
      api_key: process.env.SERPAPI_KEY,
      engine: 'amazon',
      asin,
    });

    if ('organic_results' in json) {
      return (
        json.organic_results.find(
          (data: { asin: string }) => data.asin === asin,
        )?.link ?? ''
      );
    } else if ('search_metadata' in json) {
      return json.search_metadata.amazon_url ?? '';
    } else {
      return `https://www.amazon.com/dp/${asin}`;
    }
  } catch (error) {
    console.error(`Failed to fetch link for ASIN ${asin}:`, error);
    return `https://www.amazon.com/dp/${asin}`;
  }
}

async function cacheProductData(asin: string, data: SearchResult) {
  try {
    await setCachedBlob(
      `data:${asin}`,
      data,
      1000 * 60 * 60 * 24 * 7, // 7 days
    );
  } catch (error) {
    console.error(`Failed to cache data for ASIN ${asin}:`, error);
  }
}

async function fetchAsinData(asins: string[]) {
  console.log(asins);

  // Fetch all ASINs in parallel
  const fetchPromises = asins.map(async (key) => {
    let productData = {} as SearchResult;

    // Get the product data besides the link
    productData = await getProductData(key);
    // Get the link
    productData.link = await getProductLink(key);

    console.log({ productData });

    await cacheProductData(key, productData);

    return { key, productData };
  });

  // Wait for all fetches to complete
  const fetchedResults = await Promise.all(fetchPromises);

  // Convert array to record
  const results: Record<string, SearchResult> = {};
  for (const { key, productData } of fetchedResults) {
    results[key] = productData;
  }

  return results;
}
