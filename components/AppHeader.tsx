    'use client';

    import { FC } from 'react';

    const AppHeader: FC = () => {
      return (
        <header className="col-span-12 py-[--space-md] bg-surface shadow-card rounded-[--radius-lg] mb-[--space-lg] transition duration-base ease-custom">
          <h1 className="text-display text-center">RemixFlow</h1>
          <p className="text-body text-muted text-center">Effortlessly remix audio and video, with fair creator royalties.</p>
        </header>
      );
    };

    export default AppHeader;
  