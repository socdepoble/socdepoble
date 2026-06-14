import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      // 5 minuts
      gcTime: 1000 * 60 * 30,
      // 30 minuts
      refetchOnWindowFocus: false,
      retry: 2,
      networkMode: 'offlineFirst'
    },
    mutations: {
      networkMode: 'offlineFirst'
    }
  }
});
export const QueryProvider = ({
  children
}) => <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>;