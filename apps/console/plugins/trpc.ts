import { httpBatchLink, createTRPCProxyClient } from '@trpc/client';
import type { AppRouter } from '@/server/trpc/routers';

export default defineNuxtPlugin(() => {
  const trpc = createTRPCProxyClient<AppRouter>({
    links: [
      httpBatchLink({
        url: 'http://localhost:3001/api/trpc',
      }),
    ],
  });

  return {
    provide: {
      trpc,
    },
  };
});
