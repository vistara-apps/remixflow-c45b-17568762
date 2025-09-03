'use client';

import { FC, useState } from 'react';
import Link from 'next/link';
import { useAccount } from 'wagmi';
import { ConnectWallet } from '@coinbase/onchainkit/wallet';

const AppHeader: FC = () => {
  const { address } = useAccount();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="col-span-12 flex justify-between items-center py-[--space-md]">
      <Link href="/" className="text-heading font-bold flex items-center">
        <span className="mr-2">🎵</span>
        RemixFlow
      </Link>
      
      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center space-x-[--space-md]">
        <Link href="/" className="text-text hover:text-primary transition-colors">
          Home
        </Link>
        <Link href="/dashboard" className="text-text hover:text-primary transition-colors">
          Dashboard
        </Link>
        <Link href="#features" className="text-text hover:text-primary transition-colors">
          Features
        </Link>
        
        {address ? (
          <Link 
            href="/dashboard" 
            className="px-[--space-md] py-[--space-sm] bg-primary text-bg rounded-[--radius-md] hover:bg-primary/90 transition-colors"
          >
            My Remixes
          </Link>
        ) : (
          <ConnectWallet />
        )}
      </nav>
      
      {/* Mobile Menu Button */}
      <button 
        className="md:hidden text-text"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        {mobileMenuOpen ? (
          <span className="text-xl">✕</span>
        ) : (
          <span className="text-xl">☰</span>
        )}
      </button>
      
      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-surface shadow-modal z-10">
          <nav className="flex flex-col p-[--space-md]">
            <Link 
              href="/" 
              className="py-[--space-sm] text-text hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              href="/dashboard" 
              className="py-[--space-sm] text-text hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link 
              href="#features" 
              className="py-[--space-sm] text-text hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Features
            </Link>
            
            <div className="mt-[--space-md]">
              {address ? (
                <Link 
                  href="/dashboard" 
                  className="block w-full text-center px-[--space-md] py-[--space-sm] bg-primary text-bg rounded-[--radius-md] hover:bg-primary/90 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  My Remixes
                </Link>
              ) : (
                <ConnectWallet />
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default AppHeader;

