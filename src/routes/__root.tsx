import { TanStackDevtools } from '@tanstack/react-devtools';
import type { QueryClient } from '@tanstack/react-query';
import { ReactQueryDevtoolsPanel } from '@tanstack/react-query-devtools';
import {
  createRootRouteWithContext,
  HeadContent,
  Scripts,
} from '@tanstack/react-router';
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools';
import { ApiInvalidatorDevtoolsPanel } from '@/components/api-invalidator-devtools-panel';
import { Header } from '@/components/header';
import appCss from '../styles.css?url';

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
  asins: string[];
}>()({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Stuart W. Mirsky - Author of Historical Fiction and Philosophy',
      },
      {
        name: 'description',
        content:
          "Stuart W. Mirsky is an author of historical fiction including 'The King of Vinland's Saga' and 'A Raft on the River', as well as philosophical works. Explore his books, read blog posts, and get in touch.",
      },
      {
        name: 'keywords',
        content:
          'Stuart Mirsky, Stuart W. Mirsky, King of Vinland Saga, historical fiction, philosophy, Vikings, author, books',
      },
      {
        property: 'og:title',
        content:
          'Stuart W. Mirsky - Author of Historical Fiction and Philosophy',
      },
      {
        property: 'og:description',
        content:
          "Author of historical fiction and philosophy. Explore 'The King of Vinland's Saga' and other works.",
      },
      {
        property: 'og:type',
        content: 'website',
      },
      {
        name: 'twitter:card',
        content: 'summary_large_image',
      },
      {
        name: 'twitter:title',
        content: 'Stuart W. Mirsky - Author',
      },
      {
        name: 'twitter:description',
        content:
          "Author of historical fiction and philosophy. Explore 'The King of Vinland's Saga' and other works.",
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <head>
        <HeadContent />
      </head>
      <body>
        <Header />
        {children}
        <TanStackDevtools
          config={{
            position: 'bottom-right',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
            {
              name: 'React Query',
              render: <ReactQueryDevtoolsPanel />,
            },
            {
              name: 'API Refetch',
              render: <ApiInvalidatorDevtoolsPanel />,
            },
          ]}
        />
        <Scripts />
      </body>
    </html>
  );
}
