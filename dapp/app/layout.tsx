'use client'
import '../styles/globals.css';
import WagmiProvider from "@/app/wagmi";
import { VennAccountProvider } from "./account/venn-provider";
import { QueryClient, QueryClientProvider } from 'react-query';

import { source_code_pro } from './fonts';

export default function RootLayout({
    // Layouts must accept a children prop.
    // This will be populated with nested layouts or pages
    children,
  }: {
    children: React.ReactNode
  }) {
    const queryClient = new QueryClient();

    return (
      <html lang="en">
        <body className={source_code_pro.className}>
        <WagmiProvider>
          <VennAccountProvider>
            <QueryClientProvider client={queryClient}>
              {children}
            </QueryClientProvider>
          </VennAccountProvider>
        </WagmiProvider>
        </body>
      </html>
    )
  }