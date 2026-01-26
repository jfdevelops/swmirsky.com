import { getStore } from '@netlify/blobs';

const store = getStore('serpapi-cache', {
  siteID: process.env.NETLIFY_PROJECT_ID,
  token: process.env.NETLIFY_AUTH_TOKEN,
});

type CacheEntry<T> = {
  value: T;
  fetchedAt: number;
  ttlMs: number;
};

export async function getCachedBlob<T>(key: string): Promise<T | null> {
  const entry = (await store.get(key, {
    type: 'json',
  })) as CacheEntry<T> | null;

  if (!entry) {
    return null;
  }

  const isExpired = Date.now() - entry.fetchedAt > entry.ttlMs;

  if (isExpired) {
    return null;
  }

  return entry.value;
}

export async function setCachedBlob<T>(key: string, value: T, ttlMs: number) {
  const entry: CacheEntry<T> = {
    value,
    fetchedAt: Date.now(),
    ttlMs,
  };

  await store.setJSON(key, entry);
}

/**
 * Invalidates a cache entry by deleting it, forcing a refetch on next request
 */
export async function invalidateCachedBlob(key: string) {
  try {
    await store.delete(key);
  } catch (error) {
    console.error(`Failed to invalidate cache for ${key}:`, error);
    throw error;
  }
}

/**
 * Invalidates multiple cache entries at once
 */
export async function invalidateCachedBlobs(keys: string[]) {
  await Promise.all(keys.map((key) => invalidateCachedBlob(key)));
}

/**
 * Sets a cache entry with a custom TTL, overriding the default
 * Useful for forcing immediate expiration or extending cache duration
 */
export async function setCachedBlobWithCustomTtl<T>(
  key: string,
  value: T,
  ttlMs: number,
) {
  await setCachedBlob(key, value, ttlMs);
}

/**
 * Forces a cache entry to expire immediately by setting TTL to 0
 * This will make the next getCachedBlob call return null
 */
export async function expireCachedBlob<T>(key: string) {
  try {
    const entry = (await store.get(key, {
      type: 'json',
    })) as CacheEntry<T> | null;

    if (entry) {
      // Set TTL to 0 to force immediate expiration
      const expiredEntry: CacheEntry<T> = {
        ...entry,
        ttlMs: 0,
      };
      await store.setJSON(key, expiredEntry);
    }
  } catch (error) {
    console.error(`Failed to expire cache for ${key}:`, error);
    throw error;
  }
}
