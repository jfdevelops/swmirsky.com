import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import { ASINS } from '../lib/constants';
import { DevtoolsApiRefetchEventClient } from '../lib/event-client';
import { invalidateAsinCache, type SearchResult } from '../lib/search';
import { Button } from './ui/button';

export function ApiInvalidatorDevtoolsPanel() {
  const queryClient = useQueryClient();
  const [data, setData] = useState<Record<string, SearchResult>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [allLoading, setAllLoading] = useState(false);
  const cancelledRef = useRef<Set<string>>(new Set());
  const allCancelledRef = useRef(false);

  useEffect(() => {
    const unsubscribe = DevtoolsApiRefetchEventClient.on(
      'asin-cache-invalidator',
      (event) => {
        console.log('Event received:', event.payload);
        const asins = Object.keys(event.payload.asinData);

        // Check if this operation was cancelled
        const wasCancelled =
          asins.some((asin) => cancelledRef.current.has(asin)) ||
          allCancelledRef.current;

        if (wasCancelled) {
          console.log('Operation was cancelled, clearing loading states');
          // Clear cancelled flags
          for (const asin of asins) {
            cancelledRef.current.delete(asin);
          }
          if (allCancelledRef.current) {
            allCancelledRef.current = false;
          }
          // Clear loading states without updating data
          setLoading((prev) => {
            const next = { ...prev };
            for (const asin of asins) {
              delete next[asin];
            }
            console.log('Cleared loading states (cancelled):', next);
            return next;
          });
          setAllLoading(false);
          return;
        }

        console.log('Updating data and clearing loading states for:', asins);
        setData((prev) => ({ ...prev, ...event.payload.asinData }));

        // Clear loading states for the ASINs that were fetched
        setLoading((prev) => {
          const next = { ...prev };
          for (const asin of asins) {
            delete next[asin];
          }
          console.log('Cleared loading states (success):', next);
          return next;
        });
        setAllLoading(false);
      },
    );

    return unsubscribe;
  }, []);

  const handleStopAll = () => {
    allCancelledRef.current = true;
    setAllLoading(false);
    // Mark all ASINs as cancelled and immediately clear their loading states
    const allAsins = ASINS.map(({ asin }) => asin);
    allAsins.forEach((asin) => {
      cancelledRef.current.add(asin);
    });
    // Immediately clear all loading states
    setLoading((prev) => {
      const next = { ...prev };
      for (const asin of allAsins) {
        delete next[asin];
      }
      return next;
    });
  };

  const handleInvalidateAll = async () => {
    // Reset cancellation flags
    allCancelledRef.current = false;
    cancelledRef.current.clear();
    const allAsins = ASINS.map((item) => item.asin);

    console.log('Setting loading states for all ASINs:', allAsins);

    // Set loading state for each individual ASIN FIRST
    setLoading((prev) => {
      const next = { ...prev };
      for (const asin of allAsins) {
        next[asin] = true;
      }
      console.log('Loading states set:', next);
      return next;
    });

    // Then set all loading state
    setAllLoading(true);

    // Use requestAnimationFrame to ensure React renders the loading states
    await new Promise((resolve) => requestAnimationFrame(resolve));

    try {
      // Invalidate the cache and refetch from API
      await invalidateAsinCache({ data: { asins: allAsins } });

      // Check if cancelled before invalidating React Query
      if (allCancelledRef.current) {
        // Clear loading states if cancelled
        setLoading((prev) => {
          const next = { ...prev };
          for (const asin of allAsins) {
            delete next[asin];
          }
          return next;
        });
        return;
      }

      // Invalidate React Query cache to trigger page refetch
      await queryClient.invalidateQueries({
        queryKey: ['serp-api'],
      });

      // Fallback: Clear loading states after a short delay in case event doesn't arrive
      // The event handler should clear them, but this ensures they're cleared
      setTimeout(() => {
        setLoading((prev) => {
          const next = { ...prev };
          let hasChanges = false;
          for (const asin of allAsins) {
            if (next[asin]) {
              delete next[asin];
              hasChanges = true;
            }
          }
          if (hasChanges) {
            console.log('Fallback: Clearing loading states after timeout');
          }
          return next;
        });
        setAllLoading(false);
      }, 1000);
    } catch (error) {
      if (!allCancelledRef.current) {
        console.error('Failed to invalidate all ASINs:', error);
        setAllLoading(false);
        // Clear individual loading states on error
        setLoading((prev) => {
          const next = { ...prev };
          for (const asin of allAsins) {
            delete next[asin];
          }
          return next;
        });
      }
    }
  };

  const handleStopOne = (asin: string) => {
    cancelledRef.current.add(asin);
    setLoading((prev) => {
      const next = { ...prev };
      delete next[asin];
      return next;
    });
  };

  const handleInvalidateOne = async (asin: string) => {
    // Reset cancellation flag for this ASIN
    cancelledRef.current.delete(asin);
    setLoading((prev) => ({ ...prev, [asin]: true }));
    try {
      // Invalidate the cache and refetch from API
      await invalidateAsinCache({ data: { asins: [asin] } });

      // Check if cancelled before invalidating React Query
      if (cancelledRef.current.has(asin)) {
        cancelledRef.current.delete(asin);
        setLoading((prev) => {
          const next = { ...prev };
          delete next[asin];
          return next;
        });
        return;
      }

      // Invalidate React Query cache to trigger page refetch
      await queryClient.invalidateQueries({
        queryKey: ['serp-api'],
      });

      // Fallback: Clear loading state after a short delay in case event doesn't arrive
      setTimeout(() => {
        setLoading((prev) => {
          if (prev[asin]) {
            console.log(
              `Fallback: Clearing loading state for ${asin} after timeout`,
            );
            const next = { ...prev };
            delete next[asin];
            return next;
          }
          return prev;
        });
      }, 1000);
    } catch (error) {
      if (!cancelledRef.current.has(asin)) {
        console.error(`Failed to invalidate ASIN ${asin}:`, error);
        setLoading((prev) => {
          const next = { ...prev };
          delete next[asin];
          return next;
        });
      } else {
        cancelledRef.current.delete(asin);
      }
    }
  };

  return (
    <div className='p-4 space-y-4'>
      <div className='space-y-2'>
        <h2 className='text-lg font-semibold text-white'>
          API Cache Invalidator
        </h2>
        <p className='text-sm text-gray-400'>
          Invalidate and refetch ASIN data from the API
        </p>
      </div>

      {/* Invalidate All Button */}
      <div className='space-y-2'>
        <div className='flex gap-2'>
          <Button
            onClick={handleInvalidateAll}
            disabled={allLoading}
            className='flex-1 bg-amber-500 hover:bg-amber-600 text-white disabled:opacity-50'
          >
            {allLoading
              ? 'Refetching All...'
              : 'Invalidate & Refetch All ASINs'}
          </Button>
          {allLoading && (
            <Button
              onClick={handleStopAll}
              className='bg-red-500 hover:bg-red-600 text-white'
              size='sm'
            >
              Stop
            </Button>
          )}
        </div>
      </div>

      {/* Individual ASIN Buttons */}
      <div className='space-y-2'>
        <h3 className='text-sm font-medium text-gray-300'>Individual ASINs</h3>
        <div className='space-y-2'>
          {ASINS.map(({ asin, id }) => {
            const isLoading = loading[asin] || false;
            const asinData = data[asin];

            return (
              <div
                key={asin}
                className='flex items-center justify-between gap-2 p-2 bg-slate-800/50 rounded border border-slate-700'
              >
                <div className='flex-1 min-w-0'>
                  <div className='text-sm font-mono text-gray-300 truncate flex items-center gap-2'>
                    {asin}
                    {isLoading && (
                      <span className='inline-block w-2 h-2 bg-amber-500 rounded-full animate-pulse' />
                    )}
                  </div>
                  <div className='text-xs text-gray-500 truncate'>{id}</div>
                  {isLoading && (
                    <div className='text-xs text-amber-400 mt-1'>
                      Loading...
                    </div>
                  )}
                  {asinData && !isLoading && (
                    <div className='text-xs text-amber-400 mt-1 truncate'>
                      {asinData.title}
                    </div>
                  )}
                </div>
                <div className='flex gap-1'>
                  {isLoading ? (
                    <Button
                      onClick={() => handleStopOne(asin)}
                      size='sm'
                      className='bg-red-500 hover:bg-red-600 text-white'
                    >
                      Stop
                    </Button>
                  ) : (
                    <Button
                      onClick={() => handleInvalidateOne(asin)}
                      size='sm'
                      className='bg-slate-700 hover:bg-slate-600 text-white'
                      disabled={allLoading}
                    >
                      Refetch
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Last Refetched Data Display */}
      {Object.keys(data).length > 0 && (
        <div className='space-y-2'>
          <h3 className='text-sm font-medium text-gray-300'>
            Last Refetched Data
          </h3>
          <div className='space-y-2 max-h-64 overflow-y-auto'>
            {Object.entries(data).map(([asin, result]) => (
              <div
                key={asin}
                className='p-2 bg-slate-800/30 rounded border border-slate-700 text-xs'
              >
                <div className='font-mono text-gray-400 mb-1'>{asin}</div>
                <div className='text-gray-300 space-y-1'>
                  <div>
                    <span className='text-gray-500'>Title:</span> {result.title}
                  </div>
                  <div>
                    <span className='text-gray-500'>Price:</span> {result.price}
                  </div>
                  <div>
                    <span className='text-gray-500'>Rating:</span>{' '}
                    {result.rating}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
