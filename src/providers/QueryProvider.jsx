import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,        // 5 minuts
      gcTime: 1000 * 60 * 30,          // 30 minuts
      refetchOnWindowFocus: false,     
      retry: 2,
      networkMode: 'offlineFirst',     
    },
    mutations: {
      networkMode: 'offlineFirst',
    },
  },
});

export const QueryProvider = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);
