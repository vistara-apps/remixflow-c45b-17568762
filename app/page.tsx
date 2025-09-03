    'use client';

    import { useState } from 'react';
    import { useAccount } from 'wagmi';
    import { ConnectWallet } from '@coinbase/onchainkit/wallet';
    import { Identity } from '@coinbase/onchainkit/identity';
    import AppHeader from '@/components/AppHeader';
    import ContentUploader from '@/components/ContentUploader';
    import AIRemixSettings from '@/components/AIRemixSettings';
    import RoyaltySplitter from '@/components/RoyaltySplitter';
    import OnchainStatusIndicator from '@/components/OnchainStatusIndicator';
    import PrimaryButton from '@/components/PrimaryButton';
    import { processRemix } from '@/utils/remixUtils';
    import { Redis } from '@upstash/redis';

    const redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL || '',
      token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
    });

    export default function Home() {
      const { address } = useAccount();
      const [file, setFile] = useState<File | null>(null);
      const [type, setType] = useState<'audio' | 'video'>('audio');
      const [settings, setSettings] = useState({ transformation: 'dubbing', params: {} });
      const [royalties, setRoyalties] = useState([{ recipient: '', percentage: 0 }]);
      const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
      const [remixId, setRemixId] = useState<string | null>(null);

      const handleRemix = async () => {
        if (!address || !file) return;
        setStatus('processing');
        try {
          // Simulate data model storage in Redis
          const userKey = `user:${address}`;
          await redis.hset(userKey, { userId: address, walletAddress: address, createdAt: Date.now(), updatedAt: Date.now() });

          const contentId = `content:${Date.now()}`;
          const ipfsHash = await uploadToIpfs(file); // Implement in utils
          await redis.hset(contentId, { contentId, ipfsHash, ownerAddress: address, title: file.name, description: '', royaltyPercentage: 50 });

          const remix = await processRemix(file, type, settings, royalties, address, contentId);
          await redis.hset(remix.remixId, remix);

          setRemixId(remix.remixId);
          setStatus('success');
        } catch (error) {
          console.error(error);
          setStatus('error');
        }
      };

      return (
        <main className="container max-w-4xl px-4 md:px-6 mx-auto grid grid-cols-12 gap-[16px] min-h-screen">
          <AppHeader />
          {!address ? (
            <div className="col-span-12 flex flex-col items-center justify-center">
              <ConnectWallet />
              <p className="mt-4 text-muted">Connect your wallet to start remixing.</p>
            </div>
          ) : (
            <>
              <Identity address={address} />
              <ContentUploader onFileChange={setFile} type={type} onTypeChange={setType} />
              <AIRemixSettings onSettingsChange={setSettings} />
              <RoyaltySplitter onRoyaltiesChange={setRoyalties} />
              <PrimaryButton onClick={handleRemix} disabled={!file || status === 'processing'}>
                Create Remix
              </PrimaryButton>
              <OnchainStatusIndicator status={status} remixId={remixId} />
            </>
          )}
        </main>
      );
    }
  