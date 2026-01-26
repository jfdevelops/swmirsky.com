import { EventClient } from '@tanstack/devtools-event-client';
import type { SearchResult } from './search';

type EventMap = {
  'api-refetch-devtools:asin-cache-invalidator': {
    asinData: Record<string, SearchResult>;
  };
};

class ApiRefetchEventClient extends EventClient<EventMap> {
  constructor() {
    super({
      pluginId: 'api-refetch-devtools',
    });
  }
}

export const DevtoolsApiRefetchEventClient = new ApiRefetchEventClient();
