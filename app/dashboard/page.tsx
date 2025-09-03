'use client';

import { useAccount } from 'wagmi';
import { ConnectWallet } from '@coinbase/onchainkit/wallet';
import { Identity } from '@coinbase/onchainkit/identity';
import AppHeader from '@/components/AppHeader';
import Dashboard from '@/components/Dashboard';
import ErrorBoundary from '@/components/ErrorBoundary';

export default function DashboardPage() {
  const { address } = useAccount();

  return (
    <main className="container max-w-4xl px-4 md:px-6 mx-auto grid grid-cols-12 gap-[16px] min-h-screen">
      <AppHeader />
      
      {!address ? (
        <div className="col-span-12 flex flex-col items-center justify-center">
          <ConnectWallet />
          <p className="mt-4 text-muted">Connect your wallet to view your dashboard.</p>
        </div>
      ) : (
        <>
          <div className="col-span-12 mb-[--space-md]">
            <Identity address={address} />
          </div>
          
          <ErrorBoundary>
            <Dashboard />
          </ErrorBoundary>
        </>
      )}
    </main>
  );
}

