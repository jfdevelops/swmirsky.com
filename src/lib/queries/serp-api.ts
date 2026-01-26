import { queryOptions, useQuery } from '@tanstack/react-query';
import { searchSerpApi, type SearchSerpApiInput } from '../search';

export function serpApiQuerOptions(data: SearchSerpApiInput) {
  return queryOptions({
    queryKey: ['serp-api', data],
    queryFn: () => searchSerpApi({ data }),
  });
}


export function useSerpApi(data: SearchSerpApiInput) {
  return useQuery(serpApiQuerOptions(data));
}