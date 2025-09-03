// Deploy script for RemixFlow contracts
// Run with: node deploy.js

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

