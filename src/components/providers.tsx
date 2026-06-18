"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { useState, ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000, // 5 minutes cache stale time
            refetchOnWindowFocus: false, // Prevents aggressive background fetches
            retry: 1, // Simple retry strategy
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
export default Providers;
