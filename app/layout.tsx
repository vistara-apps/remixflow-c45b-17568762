import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'RemixFlow - Effortlessly remix audio and video, with fair creator royalties',
  description: 'A tool for creators to easily remix existing audio and video content, ensuring automated royalty distribution to original rights holders.',
  keywords: ['remix', 'audio', 'video', 'royalties', 'AI', 'blockchain', 'NFT', 'provenance'],
  authors: [{ name: 'RemixFlow Team' }],
  openGraph: {
    title: 'RemixFlow - Effortlessly remix audio and video, with fair creator royalties',
    description: 'A tool for creators to easily remix existing audio and video content, ensuring automated royalty distribution to original rights holders.',
    url: 'https://remixflow.app',
    siteName: 'RemixFlow',
    images: [
      {
        url: 'https://remixflow.app/og-image.png',
        width: 1200,
        height: 630,
        alt: 'RemixFlow - Effortlessly remix audio and video, with fair creator royalties',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RemixFlow - Effortlessly remix audio and video, with fair creator royalties',
    description: 'A tool for creators to easily remix existing audio and video content, ensuring automated royalty distribution to original rights holders.',
    images: ['https://remixflow.app/og-image.png'],
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

