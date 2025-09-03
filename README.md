# RemixFlow

Effortlessly remix audio and video, with fair creator royalties.

## Overview

RemixFlow is a tool for creators to easily remix existing audio and video content, ensuring automated royalty distribution to original rights holders. The platform leverages AI for content transformation and blockchain technology for royalty management and provenance tracking.

## Core Features

### AI Audio/Video Dubbing & Style Transfer

Allows users to upload audio or video files and apply AI-powered transformations such as voice dubbing, language translation, or style transfer. Users can also specify portions of content to remix.

### Tokenized Creator Royalties

Upon remix creation, a smart contract automatically splits revenue generated from the remixed content. Original content rights holders and the remix creator receive pre-defined percentages of earnings distributed via Base USDC.

### Verifiable Remix Provenance

Each AI-assisted remix is recorded on-chain, creating a verifiable record of its origin, transformations, and ownership lineage. This can be represented by NFTs.

## Technology Stack

- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Upstash Redis
- **Blockchain**: Base (Ethereum L2)
- **Smart Contracts**: Solidity, Hardhat
- **AI**: OpenAI API
- **Storage**: IPFS (Pinata)
- **Authentication**: Wallet-based (Coinbase OnchainKit)

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Git

### Installation

1. Clone the repository:

```bash
git clone https://github.com/your-username/remixflow.git
cd remixflow
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Set up environment variables:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your API keys and configuration.

4. Run the development server:

```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Smart Contract Deployment

1. Compile the contracts:

```bash
npm run compile
# or
yarn compile
```

2. Deploy to testnet:

```bash
npm run deploy:testnet
# or
yarn deploy:testnet
```

3. Deploy to mainnet:

```bash
npm run deploy
# or
yarn deploy
```

## Project Structure

```
remixflow/
├── app/                  # Next.js app directory
│   ├── api/              # API routes
│   ├── dashboard/        # Dashboard page
│   ├── remixes/          # Remix pages
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Home page
│   └── providers.tsx     # React providers
├── components/           # React components
├── contracts/            # Smart contracts
│   ├── RoyaltySplitter.sol
│   ├── RemixProvenance.sol
│   └── deploy.js
├── docs/                 # Documentation
│   ├── api.md
│   └── contracts.md
├── models/               # Data models
├── public/               # Static assets
├── utils/                # Utility functions
│   ├── aiUtils.ts
│   ├── contractConfig.ts
│   ├── dataUtils.ts
│   ├── ipfsUtils.ts
│   ├── provenanceUtils.ts
│   └── royaltyUtils.ts
├── .env.example          # Example environment variables
├── .gitignore
├── hardhat.config.js     # Hardhat configuration
├── next.config.js        # Next.js configuration
├── package.json
├── README.md
└── tailwind.config.js    # Tailwind CSS configuration
```

## API Documentation

See [docs/api.md](docs/api.md) for detailed API documentation.

## Smart Contract Documentation

See [docs/contracts.md](docs/contracts.md) for detailed smart contract documentation.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

