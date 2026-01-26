import { queryOptions, useQuery } from '@tanstack/react-query';
import { type SearchSerpApiInput, searchSerpApi } from '../search';

export function serpApiQueryOptions(data: SearchSerpApiInput) {
  return queryOptions({
    queryKey: ['serp-api', data],
    queryFn: () => searchSerpApi({ data }),
  });
}

export function useSerpApi(data: SearchSerpApiInput) {
  return useQuery(serpApiQueryOptions(data));
}
