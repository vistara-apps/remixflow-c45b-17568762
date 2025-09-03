'use client';

import { FC } from 'react';
import Link from 'next/link';
import { Remix } from '@/models';
import { getIPFSUrl } from '@/utils/ipfsUtils';

interface Props {
  remix: Remix;
}

const RemixCard: FC<Props> = ({ remix }) => {
  // Determine the preview URL based on content type
  const isAudio = remix.contentType.startsWith('audio/');
  const isVideo = remix.contentType.startsWith('video/');
  const isImage = remix.contentType.startsWith('image/');
  const isText = remix.contentType.startsWith('text/');
  
  // Get IPFS URL for the content
  const contentUrl = getIPFSUrl(remix.ipfsHash);
  
  // Format creation date
  const creationDate = new Date(remix.creationTimestamp).toLocaleDateString();
  
  // Truncate description
  const truncatedDescription = remix.description.length > 100
    ? `${remix.description.substring(0, 100)}...`
    : remix.description;

  return (
    <div className="bg-surface rounded-[--radius-md] shadow-card overflow-hidden transition duration-base ease-custom hover:shadow-modal">
      <div className="aspect-video relative bg-bg">
        {isAudio && (
          <div className="absolute inset-0 flex items-center justify-center">
            <audio src={contentUrl} controls className="w-full px-[--space-md]" />
          </div>
        )}
        
        {isVideo && (
          <video src={contentUrl} controls className="w-full h-full object-cover" />
        )}
        
        {isImage && (
          <img src={contentUrl} alt={remix.title} className="w-full h-full object-cover" />
        )}
        
        {isText && (
          <div className="absolute inset-0 flex items-center justify-center p-[--space-md] overflow-auto">
            <pre className="text-sm text-muted whitespace-pre-wrap">
              {remix.metadata?.description || 'Text content'}
            </pre>
          </div>
        )}
        
        {!isAudio && !isVideo && !isImage && !isText && (
          <div className="absolute inset-0 flex items-center justify-center bg-bg">
            <div className="text-4xl">🎵</div>
          </div>
        )}
      </div>
      
      <div className="p-[--space-md]">
        <h3 className="text-heading mb-[--space-sm] truncate">{remix.title}</h3>
        
        <div className="flex items-center text-sm text-muted mb-[--space-sm]">
          <span className="capitalize">{remix.transformation}</span>
          <span className="mx-2">•</span>
          <span>{creationDate}</span>
        </div>
        
        <p className="text-sm text-muted mb-[--space-md]">{truncatedDescription}</p>
        
        <div className="flex justify-between items-center">
          <Link 
            href={`/remixes/${remix.remixId}`}
            className="text-primary text-sm hover:underline"
          >
            View Details
          </Link>
          
          {remix.tokenId && (
            <div className="flex items-center text-xs text-accent">
              <span className="mr-1">NFT</span>
              <span>#{remix.tokenId}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RemixCard;

