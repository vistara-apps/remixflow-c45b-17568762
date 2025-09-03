'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAccount } from 'wagmi';
import { ConnectWallet } from '@coinbase/onchainkit/wallet';
import AppHeader from '@/components/AppHeader';

export default function Home() {
  const { address } = useAccount();
  const [activeTab, setActiveTab] = useState<'audio' | 'video'>('audio');

  return (
    <main className="container max-w-4xl px-4 md:px-6 mx-auto grid grid-cols-12 gap-[16px] min-h-screen">
      <AppHeader />
      
      <div className="col-span-12 flex flex-col items-center justify-center py-[--space-xl]">
        <h1 className="text-display text-center mb-[--space-md]">
          Effortlessly remix audio and video, with fair creator royalties.
        </h1>
        
        <p className="text-body text-center text-muted mb-[--space-lg] max-w-2xl">
          RemixFlow is a tool for creators to easily remix existing audio and video content, 
          ensuring automated royalty distribution to original rights holders.
        </p>
        
        <div className="flex gap-[--space-md] mb-[--space-xl]">
          {address ? (
            <Link 
              href="/dashboard" 
              className="px-[--space-md] py-[--space-sm] bg-primary text-bg rounded-[--radius-md] hover:bg-primary/90 transition-colors"
            >
              Go to Dashboard
            </Link>
          ) : (
            <ConnectWallet />
          )}
          
          <Link 
            href="#features" 
            className="px-[--space-md] py-[--space-sm] bg-surface text-text rounded-[--radius-md] hover:bg-surface/90 transition-colors"
          >
            Learn More
          </Link>
        </div>
      </div>
      
      <div className="col-span-12 bg-surface rounded-[--radius-lg] shadow-card overflow-hidden mb-[--space-xl]">
        <div className="flex border-b border-bg">
          <button 
            className={`px-[--space-md] py-[--space-sm] ${activeTab === 'audio' ? 'bg-primary text-bg' : 'bg-surface text-text'}`}
            onClick={() => setActiveTab('audio')}
          >
            Audio Remixing
          </button>
          <button 
            className={`px-[--space-md] py-[--space-sm] ${activeTab === 'video' ? 'bg-primary text-bg' : 'bg-surface text-text'}`}
            onClick={() => setActiveTab('video')}
          >
            Video Remixing
          </button>
        </div>
        
        <div className="p-[--space-md]">
          {activeTab === 'audio' ? (
            <div className="aspect-video bg-bg rounded-[--radius-md] flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl mb-[--space-sm]">🎵</div>
                <p className="text-muted">Audio remixing demo</p>
              </div>
            </div>
          ) : (
            <div className="aspect-video bg-bg rounded-[--radius-md] flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl mb-[--space-sm]">🎬</div>
                <p className="text-muted">Video remixing demo</p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div id="features" className="col-span-12 mb-[--space-xl]">
        <h2 className="text-display text-center mb-[--space-lg]">Core Features</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[--space-md]">
          <div className="bg-surface rounded-[--radius-md] p-[--space-md] shadow-card">
            <div className="text-3xl mb-[--space-sm]">🎙️</div>
            <h3 className="text-heading mb-[--space-sm]">AI Audio/Video Dubbing & Style Transfer</h3>
            <p className="text-muted">
              Upload audio or video files and apply AI-powered transformations such as voice dubbing, 
              language translation, or style transfer.
            </p>
          </div>
          
          <div className="bg-surface rounded-[--radius-md] p-[--space-md] shadow-card">
            <div className="text-3xl mb-[--space-sm]">💰</div>
            <h3 className="text-heading mb-[--space-sm]">Tokenized Creator Royalties</h3>
            <p className="text-muted">
              Smart contracts automatically split revenue generated from remixed content. 
              Original content rights holders and remix creators receive pre-defined percentages.
            </p>
          </div>
          
          <div className="bg-surface rounded-[--radius-md] p-[--space-md] shadow-card">
            <div className="text-3xl mb-[--space-sm]">🔗</div>
            <h3 className="text-heading mb-[--space-sm]">Verifiable Remix Provenance</h3>
            <p className="text-muted">
              Each AI-assisted remix is recorded on-chain, creating a verifiable record of its origin, 
              transformations, and ownership lineage.
            </p>
          </div>
        </div>
      </div>
      
      <div className="col-span-12 mb-[--space-xl]">
        <h2 className="text-display text-center mb-[--space-lg]">How It Works</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-[--space-md]">
          <div className="bg-surface rounded-[--radius-md] p-[--space-md] shadow-card">
            <div className="text-2xl mb-[--space-sm]">1</div>
            <h3 className="text-heading mb-[--space-sm]">Upload</h3>
            <p className="text-muted">
              Upload your original audio or video content or select from existing content.
            </p>
          </div>
          
          <div className="bg-surface rounded-[--radius-md] p-[--space-md] shadow-card">
            <div className="text-2xl mb-[--space-sm]">2</div>
            <h3 className="text-heading mb-[--space-sm]">Transform</h3>
            <p className="text-muted">
              Choose from AI-powered transformations like dubbing, style transfer, or custom edits.
            </p>
          </div>
          
          <div className="bg-surface rounded-[--radius-md] p-[--space-md] shadow-card">
            <div className="text-2xl mb-[--space-sm]">3</div>
            <h3 className="text-heading mb-[--space-sm]">Configure</h3>
            <p className="text-muted">
              Set royalty splits for original creators and define your remix parameters.
            </p>
          </div>
          
          <div className="bg-surface rounded-[--radius-md] p-[--space-md] shadow-card">
            <div className="text-2xl mb-[--space-sm]">4</div>
            <h3 className="text-heading mb-[--space-sm]">Publish</h3>
            <p className="text-muted">
              Mint your remix as an NFT with verifiable provenance and automatic royalty distribution.
            </p>
          </div>
        </div>
      </div>
      
      <div className="col-span-12 mb-[--space-xl]">
        <div className="bg-surface rounded-[--radius-md] p-[--space-md] shadow-card text-center">
          <h2 className="text-heading mb-[--space-md]">Ready to start remixing?</h2>
          
          <div className="flex justify-center gap-[--space-md]">
            {address ? (
              <Link 
                href="/dashboard" 
                className="px-[--space-md] py-[--space-sm] bg-primary text-bg rounded-[--radius-md] hover:bg-primary/90 transition-colors"
              >
                Go to Dashboard
              </Link>
            ) : (
              <ConnectWallet />
            )}
          </div>
        </div>
      </div>
      
      <footer className="col-span-12 text-center text-muted text-sm py-[--space-md]">
        <p>© 2025 RemixFlow. All rights reserved.</p>
      </footer>
    </main>
  );
}

