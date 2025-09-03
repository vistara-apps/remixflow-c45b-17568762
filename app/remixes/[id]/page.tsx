'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useAccount } from 'wagmi';
import AppHeader from '@/components/AppHeader';
import LoadingIndicator from '@/components/LoadingIndicator';
import ErrorBoundary from '@/components/ErrorBoundary';
import { Remix } from '@/models';
import { RemixData } from '@/utils/dataUtils';
import { getRoyaltyInfo } from '@/utils/royaltyUtils';
import { getIPFSUrl } from '@/utils/ipfsUtils';

export default function RemixDetailPage() {
  const { id } = useParams();
  const { address } = useAccount();
  const [remix, setRemix] = useState<Remix | null>(null);
  const [royaltyInfo, setRoyaltyInfo] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchRemixData = async () => {
      try {
        setLoading(true);
        
        // Fetch remix data
        const remixData = await RemixData.getRemix(id as string);
        
        if (!remixData) {
          setError('Remix not found');
          return;
        }
        
        setRemix(remixData);
        
        // Fetch royalty information
        const royaltyData = await getRoyaltyInfo(id as string);
        setRoyaltyInfo(royaltyData);
        
        setError(null);
      } catch (err) {
        console.error('Error fetching remix data:', err);
        setError('Failed to load remix data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchRemixData();
  }, [id]);

  // Determine content type and URL
  const getContentPreview = () => {
    if (!remix) return null;
    
    const contentUrl = getIPFSUrl(remix.ipfsHash);
    
    if (remix.contentType.startsWith('audio/')) {
      return (
        <div className="w-full bg-bg rounded-[--radius-md] p-[--space-md]">
          <audio src={contentUrl} controls className="w-full" />
        </div>
      );
    }
    
    if (remix.contentType.startsWith('video/')) {
      return (
        <div className="w-full bg-bg rounded-[--radius-md] overflow-hidden">
          <video src={contentUrl} controls className="w-full" />
        </div>
      );
    }
    
    if (remix.contentType.startsWith('image/')) {
      return (
        <div className="w-full bg-bg rounded-[--radius-md] overflow-hidden">
          <img src={contentUrl} alt={remix.title} className="w-full h-auto" />
        </div>
      );
    }
    
    if (remix.contentType.startsWith('text/')) {
      return (
        <div className="w-full bg-bg rounded-[--radius-md] p-[--space-md] overflow-auto max-h-[400px]">
          <pre className="text-sm text-muted whitespace-pre-wrap">
            {remix.metadata?.description || 'Text content'}
          </pre>
        </div>
      );
    }
    
    return (
      <div className="w-full bg-bg rounded-[--radius-md] p-[--space-md] flex items-center justify-center">
        <p className="text-muted">Preview not available for this content type</p>
      </div>
    );
  };

  return (
    <main className="container max-w-4xl px-4 md:px-6 mx-auto grid grid-cols-12 gap-[16px] min-h-screen">
      <AppHeader />
      
      <div className="col-span-12">
        <Link href="/dashboard" className="text-primary hover:underline mb-[--space-md] inline-block">
          &larr; Back to Dashboard
        </Link>
      </div>
      
      <ErrorBoundary>
        {loading ? (
          <div className="col-span-12">
            <LoadingIndicator message="Loading remix details..." />
          </div>
        ) : error ? (
          <div className="col-span-12 p-[--space-md] bg-surface rounded-[--radius-md] shadow-card">
            <p className="text-center text-red-500">{error}</p>
          </div>
        ) : remix ? (
          <>
            <div className="col-span-12 md:col-span-8">
              <h1 className="text-display mb-[--space-sm]">{remix.title}</h1>
              
              <div className="flex items-center text-sm text-muted mb-[--space-md]">
                <span className="capitalize">{remix.transformation} Remix</span>
                <span className="mx-2">•</span>
                <span>{new Date(remix.creationTimestamp).toLocaleDateString()}</span>
                {remix.tokenId && (
                  <>
                    <span className="mx-2">•</span>
                    <span className="text-accent">NFT #{remix.tokenId}</span>
                  </>
                )}
              </div>
              
              <div className="mb-[--space-md]">
                {getContentPreview()}
              </div>
              
              <div className="mb-[--space-lg]">
                <h2 className="text-heading mb-[--space-sm]">Description</h2>
                <p className="text-muted">{remix.description}</p>
              </div>
              
              <div className="mb-[--space-lg]">
                <h2 className="text-heading mb-[--space-sm]">Transformation Details</h2>
                <div className="bg-surface rounded-[--radius-md] p-[--space-md] shadow-card">
                  <div className="grid grid-cols-2 gap-[--space-sm]">
                    <div>
                      <p className="text-sm text-muted">Type</p>
                      <p className="capitalize">{remix.transformation}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted">Parameters</p>
                      <p>{remix.transformationParams.language || 'Default'}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mb-[--space-lg]">
                <h2 className="text-heading mb-[--space-sm]">On-chain Provenance</h2>
                <div className="bg-surface rounded-[--radius-md] p-[--space-md] shadow-card">
                  <div className="grid grid-cols-1 gap-[--space-sm]">
                    <div>
                      <p className="text-sm text-muted">NFT Token ID</p>
                      <p>{remix.tokenId || 'Not minted'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted">Transaction Hash</p>
                      <p className="truncate">
                        {remix.onchainTxHash ? (
                          <a 
                            href={`https://basescan.org/tx/${remix.onchainTxHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            {remix.onchainTxHash}
                          </a>
                        ) : (
                          'Not available'
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted">IPFS Hash</p>
                      <p className="truncate">
                        <a 
                          href={getIPFSUrl(remix.ipfsHash)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          {remix.ipfsHash}
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col-span-12 md:col-span-4">
              <div className="bg-surface rounded-[--radius-md] p-[--space-md] shadow-card mb-[--space-md]">
                <h2 className="text-heading mb-[--space-md]">Royalty Distribution</h2>
                
                {royaltyInfo ? (
                  <>
                    <div className="mb-[--space-md]">
                      <p className="text-sm text-muted mb-[--space-sm]">Total Paid</p>
                      <p className="text-lg">{royaltyInfo.totalPaid || 0} ETH</p>
                    </div>
                    
                    <div className="mb-[--space-md]">
                      <p className="text-sm text-muted mb-[--space-sm]">Splits</p>
                      {royaltyInfo.splits && royaltyInfo.splits.length > 0 ? (
                        <div className="space-y-[--space-sm]">
                          {royaltyInfo.splits.map((split: any) => (
                            <div key={split.splitId} className="flex justify-between">
                              <p className="truncate max-w-[70%]">{split.recipientAddress}</p>
                              <p>{split.percentage}%</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted">No royalty splits defined</p>
                      )}
                    </div>
                    
                    <div>
                      <p className="text-sm text-muted mb-[--space-sm]">Last Distribution</p>
                      <p>
                        {royaltyInfo.lastDistribution ? (
                          new Date(royaltyInfo.lastDistribution).toLocaleDateString()
                        ) : (
                          'Never'
                        )}
                      </p>
                    </div>
                  </>
                ) : (
                  <LoadingIndicator message="Loading royalty info..." size="sm" />
                )}
              </div>
              
              <div className="bg-surface rounded-[--radius-md] p-[--space-md] shadow-card">
                <h2 className="text-heading mb-[--space-md]">Original Content</h2>
                
                <div className="mb-[--space-sm]">
                  <p className="text-sm text-muted">Creator</p>
                  <p className="truncate">{remix.creatorAddress}</p>
                </div>
                
                <div>
                  <p className="text-sm text-muted">Original IPFS Hash</p>
                  <p className="truncate">
                    <a 
                      href={getIPFSUrl(remix.originalIpfsHash)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {remix.originalIpfsHash}
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </ErrorBoundary>
    </main>
  );
}

