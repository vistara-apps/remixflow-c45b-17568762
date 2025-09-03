'use client';

import { FC, ReactNode } from 'react';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { base } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { OnchainProvider } from '@coinbase/onchainkit/wallet';

interface ProvidersProps {
  children: ReactNode;
}

// Create a Wagmi config
const config = createConfig({
  chains: [base],
  transports: {
    [base.id]: http(),
  },
});

// Create a React Query client
const queryClient = new QueryClient();

export const Providers: FC<ProvidersProps> = ({ children }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <OnchainProvider>
          {children}
        </OnchainProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

