# RemixFlow Smart Contracts Documentation

This document provides comprehensive documentation for the RemixFlow smart contracts, which enable royalty distribution and provenance tracking for audio and video remixes.

## Contract Addresses

### Base Mainnet

- **RoyaltySplitter**: `0x0000000000000000000000000000000000000000` (placeholder)
- **RemixProvenance**: `0x0000000000000000000000000000000000000000` (placeholder)

### Base Testnet (Sepolia)

- **RoyaltySplitter**: `0x0000000000000000000000000000000000000000` (placeholder)
- **RemixProvenance**: `0x0000000000000000000000000000000000000000` (placeholder)

## RoyaltySplitter Contract

The `RoyaltySplitter` contract manages royalty distribution for remixes. It allows for registering remixes with custom royalty splits and distributing payments to recipients based on their percentage shares.

### Contract Structure

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract RoyaltySplitter is Ownable, ReentrancyGuard {
    struct Split {
        address recipient;
        uint256 percentage;
    }

    struct RemixRoyalty {
        string remixId;
        address creator;
        Split[] splits;
        uint256 totalReceived;
        uint256 lastDistribution;
    }

    // Mapping from remix ID to royalty information
    mapping(string => RemixRoyalty) private _remixRoyalties;
    
    // Array of all remix IDs
    string[] private _allRemixIds;

    // Events
    event RoyaltiesSplit(string indexed remixId, address indexed remixCreator, uint256 amount);
    event RoyaltyRegistered(string indexed remixId, address indexed creator);
    event RoyaltyReceived(string indexed remixId, uint256 amount);

    // Functions
    function registerRemix(string memory remixId, address creator, Split[] memory splits) external;
    function splitRoyalties(string memory remixId) external payable nonReentrant;
    function getRoyaltyInfo(string memory remixId) external view returns (address, uint256, uint256, uint256);
    function getSplit(string memory remixId, uint256 index) external view returns (address, uint256);
    function getAllRemixIds() external view returns (string[] memory);
    function withdrawStuckFunds(uint256 amount) external onlyOwner;
}
```

### Functions

#### `registerRemix`

```solidity
function registerRemix(
    string memory remixId,
    address creator,
    Split[] memory splits
) external
```

Registers a new remix for royalty distribution.

**Parameters:**
- `remixId`: Unique identifier for the remix
- `creator`: Address of the remix creator
- `splits`: Array of royalty splits, each containing a recipient address and percentage

**Requirements:**
- Remix ID cannot be empty
- Creator address cannot be zero
- Each recipient address cannot be zero
- Each percentage must be greater than zero
- Total percentage cannot exceed 100

**Events:**
- `RoyaltyRegistered(remixId, creator)`

#### `splitRoyalties`

```solidity
function splitRoyalties(string memory remixId) external payable nonReentrant
```

Splits royalties for a specific remix.

**Parameters:**
- `remixId`: ID of the remix

**Requirements:**
- Remix ID cannot be empty
- Amount must be greater than zero
- Remix must be registered

**Events:**
- `RoyaltiesSplit(remixId, creator, amount)`

#### `getRoyaltyInfo`

```solidity
function getRoyaltyInfo(string memory remixId) 
    external 
    view 
    returns (
        address creator,
        uint256 totalReceived,
        uint256 lastDistribution,
        uint256 splitCount
    )
```

Gets royalty information for a remix.

**Parameters:**
- `remixId`: ID of the remix

**Returns:**
- `creator`: Creator address
- `totalReceived`: Total amount received
- `lastDistribution`: Timestamp of last distribution
- `splitCount`: Number of splits

#### `getSplit`

```solidity
function getSplit(string memory remixId, uint256 index) 
    external 
    view 
    returns (
        address recipient,
        uint256 percentage
    )
```

Gets a specific split for a remix.

**Parameters:**
- `remixId`: ID of the remix
- `index`: Index of the split

**Returns:**
- `recipient`: Recipient address
- `percentage`: Percentage of the split

**Requirements:**
- Index must be within bounds

#### `getAllRemixIds`

```solidity
function getAllRemixIds() external view returns (string[] memory)
```

Gets all remix IDs.

**Returns:**
- Array of remix IDs

#### `withdrawStuckFunds`

```solidity
function withdrawStuckFunds(uint256 amount) external onlyOwner
```

Withdraws any stuck funds to the owner.

**Parameters:**
- `amount`: Amount to withdraw

**Requirements:**
- Caller must be the owner
- Amount must be less than or equal to the contract balance

### Usage Example

```javascript
// Connect to the contract
const royaltySplitter = new ethers.Contract(
  ROYALTY_SPLITTER_ADDRESS,
  ROYALTY_SPLITTER_ABI,
  signer
);

// Register a remix
await royaltySplitter.registerRemix(
  'remix:1632150985000',
  '0x1234...',
  [
    { recipient: '0x5678...', percentage: 30 },
    { recipient: '0x9abc...', percentage: 20 }
  ]
);

// Distribute royalties
await royaltySplitter.splitRoyalties(
  'remix:1632150985000',
  { value: ethers.utils.parseEther('0.1') }
);

// Get royalty information
const royaltyInfo = await royaltySplitter.getRoyaltyInfo('remix:1632150985000');
console.log(royaltyInfo);
```

## RemixProvenance Contract

The `RemixProvenance` contract is an ERC721 token that tracks the provenance of remixes. Each remix is represented by a unique NFT that contains metadata about the original content, the remix, and the transformation applied.

### Contract Structure

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract RemixProvenance is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    // Mapping from token ID to original content IPFS hash
    mapping(uint256 => string) private _originalContentHashes;
    
    // Mapping from token ID to remix creator address
    mapping(uint256 => address) private _remixCreators;
    
    // Mapping from token ID to remix transformation type
    mapping(uint256 => string) private _transformationTypes;
    
    // Mapping from original content hash to array of remix token IDs
    mapping(string => uint256[]) private _remixesByOriginalContent;

    // Event emitted when a new remix is minted
    event RemixMinted(
        uint256 indexed tokenId,
        address indexed creator,
        string originalContentHash,
        string remixContentHash,
        string transformationType
    );

    // Functions
    function mintRemix(
        address creator,
        string memory originalContentHash,
        string memory remixContentHash,
        string memory transformationType,
        string memory tokenURI
    ) public returns (uint256);
    
    function getOriginalContentHash(uint256 tokenId) public view returns (string memory);
    function getRemixCreator(uint256 tokenId) public view returns (address);
    function getTransformationType(uint256 tokenId) public view returns (string memory);
    function getRemixesByOriginalContent(string memory originalContentHash) public view returns (uint256[] memory);
    function getTotalRemixes() public view returns (uint256);
}
```

### Functions

#### `mintRemix`

```solidity
function mintRemix(
    address creator,
    string memory originalContentHash,
    string memory remixContentHash,
    string memory transformationType,
    string memory tokenURI
) public returns (uint256)
```

Mints a new remix NFT.

**Parameters:**
- `creator`: Address of the remix creator
- `originalContentHash`: IPFS hash of the original content
- `remixContentHash`: IPFS hash of the remixed content
- `transformationType`: Type of transformation applied (e.g., "dubbing", "styleTransfer")
- `tokenURI`: URI for the token metadata

**Returns:**
- The ID of the newly minted token

**Requirements:**
- Original content hash cannot be empty
- Remix content hash cannot be empty
- Creator address cannot be zero

**Events:**
- `RemixMinted(tokenId, creator, originalContentHash, remixContentHash, transformationType)`

#### `getOriginalContentHash`

```solidity
function getOriginalContentHash(uint256 tokenId) public view returns (string memory)
```

Returns the original content hash for a given token ID.

**Parameters:**
- `tokenId`: The ID of the token

**Returns:**
- The original content hash

**Requirements:**
- Token must exist

#### `getRemixCreator`

```solidity
function getRemixCreator(uint256 tokenId) public view returns (address)
```

Returns the remix creator for a given token ID.

**Parameters:**
- `tokenId`: The ID of the token

**Returns:**
- The remix creator address

**Requirements:**
- Token must exist

#### `getTransformationType`

```solidity
function getTransformationType(uint256 tokenId) public view returns (string memory)
```

Returns the transformation type for a given token ID.

**Parameters:**
- `tokenId`: The ID of the token

**Returns:**
- The transformation type

**Requirements:**
- Token must exist

#### `getRemixesByOriginalContent`

```solidity
function getRemixesByOriginalContent(string memory originalContentHash) public view returns (uint256[] memory)
```

Returns all remix token IDs for a given original content hash.

**Parameters:**
- `originalContentHash`: The original content hash

**Returns:**
- Array of token IDs

#### `getTotalRemixes`

```solidity
function getTotalRemixes() public view returns (uint256)
```

Returns the total number of remixes minted.

**Returns:**
- The total number of remixes

### Usage Example

```javascript
// Connect to the contract
const remixProvenance = new ethers.Contract(
  REMIX_PROVENANCE_ADDRESS,
  REMIX_PROVENANCE_ABI,
  signer
);

// Mint a remix NFT
const tx = await remixProvenance.mintRemix(
  '0x1234...',
  'QmX...',
  'QmY...',
  'dubbing',
  'ipfs://QmZ...'
);
const receipt = await tx.wait();
const event = receipt.events.find(e => e.event === 'RemixMinted');
const tokenId = event.args.tokenId;

// Get original content hash
const originalContentHash = await remixProvenance.getOriginalContentHash(tokenId);
console.log(originalContentHash);

// Get remixes by original content
const remixes = await remixProvenance.getRemixesByOriginalContent('QmX...');
console.log(remixes);
```

## Deployment

The contracts can be deployed using the provided deployment script:

```javascript
// Deploy script for RemixFlow contracts
const { ethers } = require('ethers');
require('dotenv').config();

// Contract artifacts
const RoyaltySplitterArtifact = require('./artifacts/contracts/RoyaltySplitter.sol/RoyaltySplitter.json');
const RemixProvenanceArtifact = require('./artifacts/contracts/RemixProvenance.sol/RemixProvenance.json');

async function main() {
  // Connect to the network
  const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  
  console.log(`Deploying contracts with the account: ${wallet.address}`);
  console.log(`Account balance: ${ethers.utils.formatEther(await wallet.getBalance())} ETH`);

  // Deploy RoyaltySplitter
  console.log('Deploying RoyaltySplitter...');
  const RoyaltySplitterFactory = new ethers.ContractFactory(
    RoyaltySplitterArtifact.abi,
    RoyaltySplitterArtifact.bytecode,
    wallet
  );
  const royaltySplitter = await RoyaltySplitterFactory.deploy();
  await royaltySplitter.deployed();
  console.log(`RoyaltySplitter deployed to: ${royaltySplitter.address}`);

  // Deploy RemixProvenance
  console.log('Deploying RemixProvenance...');
  const RemixProvenanceFactory = new ethers.ContractFactory(
    RemixProvenanceArtifact.abi,
    RemixProvenanceArtifact.bytecode,
    wallet
  );
  const remixProvenance = await RemixProvenanceFactory.deploy();
  await remixProvenance.deployed();
  console.log(`RemixProvenance deployed to: ${remixProvenance.address}`);

  // Output contract addresses
  console.log('\nDeployment complete!');
  console.log('Contract addresses:');
  console.log(`RoyaltySplitter: ${royaltySplitter.address}`);
  console.log(`RemixProvenance: ${remixProvenance.address}`);
  
  // Verify contracts on Basescan (if API key is provided)
  if (process.env.BASESCAN_API_KEY) {
    console.log('\nVerifying contracts on Basescan...');
    
    // Verify RoyaltySplitter
    console.log('Verifying RoyaltySplitter...');
    await verifyContract(royaltySplitter.address, []);
    
    // Verify RemixProvenance
    console.log('Verifying RemixProvenance...');
    await verifyContract(remixProvenance.address, []);
  }
}

async function verifyContract(contractAddress, constructorArguments) {
  try {
    await hre.run('verify:verify', {
      address: contractAddress,
      constructorArguments: constructorArguments,
    });
    console.log(`Contract at ${contractAddress} verified successfully`);
  } catch (error) {
    console.error(`Error verifying contract at ${contractAddress}:`, error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```

## Security Considerations

The RemixFlow contracts have been designed with security in mind:

1. **Reentrancy Protection**: The `RoyaltySplitter` contract uses OpenZeppelin's `ReentrancyGuard` to prevent reentrancy attacks.

2. **Access Control**: Both contracts use OpenZeppelin's `Ownable` for access control, ensuring that only authorized users can perform certain actions.

3. **Input Validation**: All functions include input validation to ensure that parameters meet the required criteria.

4. **Gas Optimization**: The contracts have been optimized for gas efficiency, using appropriate data structures and minimizing storage operations.

5. **Event Emission**: Events are emitted for all important state changes, allowing for easy tracking of contract activity.

6. **Upgradability**: The contracts are not upgradable by design, ensuring that the rules of royalty distribution and provenance tracking cannot be changed after deployment.

## Audit

The RemixFlow contracts have not yet been audited by a third-party security firm. An audit is planned for the future to ensure the security and reliability of the contracts.

## License

The RemixFlow contracts are licensed under the MIT License.

