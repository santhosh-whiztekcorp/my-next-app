import { QueryClient } from '@tanstack/react-query';
import { QUERY_CONFIG } from '@/constants';

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: QUERY_CONFIG.STALE_TIME,
      },
    },
  });
}

let queryClient: QueryClient | undefined = undefined;

export function getQueryClient() {
  if (typeof window === 'undefined') {
    // Server: always make a new query client
    return makeQueryClient();
  } else {
    // Browser: make a new query client if we don't already have one
    if (!queryClient) queryClient = makeQueryClient();
    return queryClient;
  }
}
