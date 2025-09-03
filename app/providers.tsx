    'use client';

    import { OnchainKitProvider } from '@coinbase/onchainkit';
    import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
    import { WagmiProvider } from 'wagmi';
    import { createConfig } from 'wagmi';
    import { base } from 'viem/chains';
    import { http } from 'viem';
    import { type ReactNode, useState } from 'react';
    import { PrivyProvider } from '@privy-io/react-auth';

    const config = createConfig({
      chains: [base],
      transports: {
        [base.id]: http(),
      },
    });

    export function Providers(props: { children: ReactNode }) {
      const [queryClient] = useState(() => new QueryClient());

      return (
        <PrivyProvider
          appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ''}
          config={{
            appearance: { theme: 'dark' },
            embeddedWallets: { createOnLogin: 'users-without-wallets' },
          }}
        >
          <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
              <OnchainKitProvider
                chain={base}
                config={{
                  appearance: {
                    mode: 'dark',
                    theme: 'default',
                    name: 'RemixFlow',
                  },
                }}
              >
                {props.children}
              </OnchainKitProvider>
            </QueryClientProvider>
          </WagmiProvider>
        </PrivyProvider>
      );
    }
  