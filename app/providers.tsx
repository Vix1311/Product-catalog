"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export default function Providers({ children }: { children: React.ReactNode }) {
  // Dùng useState để đảm bảo QueryClient không bị khởi tạo lại mỗi lần re-render
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // Dữ liệu được coi là tươi mới trong 1 phút
            refetchOnWindowFocus: false, // Tắt tự refetch khi đổi tab (nếu muốn)
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
