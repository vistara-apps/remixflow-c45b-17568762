'use client';

import { FC, useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { Remix } from '@/models';
import { UserData, RemixData } from '@/utils/dataUtils';
import RemixCard from './RemixCard';
import LoadingIndicator from './LoadingIndicator';

interface Props {
  initialRemixes?: Remix[];
}

const Dashboard: FC<Props> = ({ initialRemixes = [] }) => {
  const { address } = useAccount();
  const [remixes, setRemixes] = useState<Remix[]>(initialRemixes);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!address) return;

    const fetchRemixes = async () => {
      try {
        setLoading(true);
        
        // Get user's remixes
        const remixIds = await UserData.getUserRemixes(address);
        
        // Fetch each remix
        const remixPromises = remixIds.map(id => RemixData.getRemix(id));
        const remixResults = await Promise.all(remixPromises);
        
        // Filter out null results
        const validRemixes = remixResults.filter(remix => remix !== null) as Remix[];
        
        setRemixes(validRemixes);
        setError(null);
      } catch (err) {
        console.error('Error fetching remixes:', err);
        setError('Failed to load remixes. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchRemixes();
  }, [address]);

  if (!address) {
    return (
      <div className="col-span-12 p-[--space-md] bg-surface rounded-[--radius-md] shadow-card">
        <p className="text-center text-muted">Connect your wallet to view your dashboard.</p>
      </div>
    );
  }

  return (
    <div className="col-span-12">
      <h2 className="text-heading mb-[--space-md]">Your Remixes</h2>
      
      {loading ? (
        <LoadingIndicator message="Loading your remixes..." />
      ) : error ? (
        <div className="p-[--space-md] bg-surface rounded-[--radius-md] shadow-card">
          <p className="text-center text-red-500">{error}</p>
        </div>
      ) : remixes.length === 0 ? (
        <div className="p-[--space-md] bg-surface rounded-[--radius-md] shadow-card">
          <p className="text-center text-muted">You haven't created any remixes yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[--space-md]">
          {remixes.map(remix => (
            <RemixCard key={remix.remixId} remix={remix} />
          ))}
        </div>
      )}
      
      <h2 className="text-heading mt-[--space-xl] mb-[--space-md]">Your Earnings</h2>
      
      <div className="p-[--space-md] bg-surface rounded-[--radius-md] shadow-card">
        <p className="text-center text-muted">Earnings dashboard coming soon.</p>
      </div>
    </div>
  );
};

export default Dashboard;

