    'use client';

    import { FC } from 'react';

    interface Props {
      status: 'idle' | 'processing' | 'success' | 'error';
      remixId: string | null;
    }

    const OnchainStatusIndicator: FC<Props> = ({ status, remixId }) => {
      let content;
      switch (status) {
        case 'processing':
          content = <p className="text-muted">Processing remix...</p>;
          break;
        case 'success':
          content = <p className="text-accent">Remix created! ID: {remixId}</p>;
          break;
        case 'error':
          content = <p className="text-red-500">Error occurred. Try again.</p>;
          break;
        default:
          content = null;
      }

      return (
        <div className="col-span-12 mt-[--space-md] text-center transition duration-slow ease-custom">
          {content}
        </div>
      );
    };

    export default OnchainStatusIndicator;
  