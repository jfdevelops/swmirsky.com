import { QueryClient } from '@tanstack/react-query';
import { createRouter } from '@tanstack/react-router';
import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query';
import { ASINS } from './lib/constants';
import { routeTree } from './routeTree.gen';

const asinStrings = ASINS.map((item) => item.asin);

export function getRouter() {
  const queryClient = new QueryClient();

  // Extract ASIN strings for the API

  const router = createRouter({
    routeTree,
    context: { queryClient, asins: asinStrings },
    defaultPreload: 'intent',
  });
  setupRouterSsrQueryIntegration({
    router,
    queryClient,
  });

  return router;
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
