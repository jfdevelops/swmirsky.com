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
  price: string;
};
export type SearchSerpApiInput = typeof searchSerpApiSchema.infer;

export const searchSerpApiSchema = type({
  asins: 'string[]',
});
export const searchSerpApi = createServerFn({ method: 'GET' })
  .inputValidator(searchSerpApiSchema)
  .handler(async ({ data }) => {
    const results: Record<string, SearchResult> = {};
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

    // Fetch only what's missing
    for (const key of missingKeys) {
      let productData = {} as SearchResult;

      // Get the product data besides the link
      try {
        const json = await getJson({
          api_key: process.env.SERPAPI_KEY,
          engine: 'amazon_product',
          asin: key,
        });

        // Validate API response structure
        if (!json?.product_results) {
          console.error(`Invalid API response for ASIN ${key}:`, json);
          continue;
        }

        productData = {
          title: json.product_results.title as string,
          link: '',
          thumbnails: (json.product_results.thumbnails as string[]) || [],
          rating: (json.product_results.rating as number) || 0,
          reviews: (json.product_results.reviews as number) || 0,
          price: (json.product_results.price as string) || '',
        };
      } catch (error) {
        // Log error but don't fail the entire request
        console.error(`Failed to fetch data for ASIN ${key}:`, error);
        // Optionally, you could set a default/error result here
      }

      // Get the link
      try {
        const json = await getJson({
          api_key: process.env.SERPAPI_KEY,
          engine: 'amazon',
          asin: key,
        });

        if ('organic_results' in json) {
          productData.link = json.organic_results.find(
            ({ asin }: { asin: string }) => asin === key,
          )?.link;
        } else if ('search_metadata' in json) {
          productData.link = json.search_metadata.amazon_url;
        } else {
          productData.link = `https://www.amazon.com/dp/${key}`;
        }
      } catch (error) {
        console.error(`Failed to fetch link for ASIN ${key}:`, error);
        productData.link = `https://www.amazon.com/dp/${key}`;
      }

      // Cache the result before adding to results
      try {
        await setCachedBlob<SearchResult>(
          `data:${key}`,
          productData,
          1000 * 60 * 60 * 24 * 7, // 7 days
        );
      } catch (cacheError) {
        // Log cache write error but continue - we still have the data
        console.error(`Failed to cache data for ${key}:`, cacheError);
      }

      results[key] = productData;
    }

    return results;
  });

/**
 * Invalidates cache for specific ASINs, forcing a refetch on next request
 */
export const invalidateAsinCacheSchema = type({
  asins: 'string[]',
});

export type InvalidateAsinCacheInput = typeof invalidateAsinCacheSchema.infer;

export const invalidateAsinCache = createServerFn({ method: 'POST' })
  .inputValidator(invalidateAsinCacheSchema)
  .handler(async ({ data }) => {
    const keys = data.asins.map((asin) => `data:${asin}`);
    await invalidateCachedBlobs(keys);

    // Fetch fresh data immediately after invalidation
    const freshData: Record<string, SearchResult> = {};

    for (const asin of data.asins) {
      let productData = {} as SearchResult;

      // Get the product data besides the link
      try {
        const json = await getJson({
          api_key: process.env.SERPAPI_KEY,
          engine: 'amazon_product',
          asin,
        });

        // Validate API response structure
        if (!json?.product_results) {
          console.error(`Invalid API response for ASIN ${asin}:`, json);
          continue;
        }

        productData = {
          title: json.product_results.title as string,
          link: '',
          thumbnails: (json.product_results.thumbnails as string[]) || [],
          rating: (json.product_results.rating as number) || 0,
          reviews: (json.product_results.reviews as number) || 0,
          price: (json.product_results.price as string) || '',
        };
      } catch (error) {
        console.error(`Failed to fetch data for ASIN ${asin}:`, error);
        continue;
      }

      // Get the link
      try {
        const json = await getJson({
          api_key: process.env.SERPAPI_KEY,
          engine: 'amazon',
          asin,
        });

        if ('organic_results' in json) {
          productData.link = json.organic_results.find(
            ({ asin: resultAsin }: { asin: string }) => resultAsin === asin,
          )?.link;
        } else if ('search_metadata' in json) {
          productData.link = json.search_metadata.amazon_url;
        } else {
          productData.link = `https://www.amazon.com/dp/${asin}`;
        }
      } catch (error) {
        console.error(`Failed to fetch link for ASIN ${asin}:`, error);
        productData.link = `https://www.amazon.com/dp/${asin}`;
      }

      // Cache the fresh result
      try {
        await setCachedBlob<SearchResult>(
          `data:${asin}`,
          productData,
          1000 * 60 * 60 * 24 * 7, // 7 days
        );
      } catch (cacheError) {
        console.error(`Failed to cache data for ${asin}:`, cacheError);
      }

      freshData[asin] = productData;
    }

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
