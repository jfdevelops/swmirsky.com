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
        // Check if this operation was cancelled
        const asins = Object.keys(event.payload.asinData);
        const wasCancelled =
          asins.some((asin) => cancelledRef.current.has(asin)) ||
          allCancelledRef.current;

        if (wasCancelled) {
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
            return next;
          });
          setAllLoading(false);
          return;
        }

        setData((prev) => ({ ...prev, ...event.payload.asinData }));
        // Clear loading states for the ASINs that were fetched
        setLoading((prev) => {
          const next = { ...prev };
          for (const asin of asins) {
            delete next[asin];
          }
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
    // Mark all ASINs as cancelled
    ASINS.forEach(({ asin }) => {
      cancelledRef.current.add(asin);
    });
  };

  const handleInvalidateAll = async () => {
    // Reset cancellation flags
    allCancelledRef.current = false;
    cancelledRef.current.clear();
    setAllLoading(true);
    const allAsins = ASINS.map((item) => item.asin);
    try {
      // Invalidate the cache and refetch from API
      await invalidateAsinCache({ data: { asins: allAsins } });

      // Check if cancelled before invalidating React Query
      if (allCancelledRef.current) {
        return;
      }

      // Invalidate React Query cache to trigger page refetch
      await queryClient.invalidateQueries({
        queryKey: ['serp-api'],
      });
    } catch (error) {
      if (!allCancelledRef.current) {
        console.error('Failed to invalidate all ASINs:', error);
        setAllLoading(false);
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
        return;
      }

      // Invalidate React Query cache to trigger page refetch
      await queryClient.invalidateQueries({
        queryKey: ['serp-api'],
      });
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
                  <div className='text-sm font-mono text-gray-300 truncate'>
                    {asin}
                  </div>
                  <div className='text-xs text-gray-500 truncate'>{id}</div>
                  {asinData && (
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
