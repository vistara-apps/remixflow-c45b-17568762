    /** @type {import('next').NextConfig} */
    const nextConfig = {
      reactStrictMode: true,
      transpilePackages: ['viem', 'wagmi'],
      images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: '**',
          },
        ],
      },
    };

    export default nextConfig;
  