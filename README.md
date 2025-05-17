# Coffee Mate ☕

A decentralized application where you can support a creator by buying them coffee! Built with Next.js, Foundry, and deployed on Sepolia testnet.

## Features

- Fund the contract owner with ETH
- View all funders
- Track contract balance
- Owner can withdraw funds

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

## Local Development

### Prerequisites

- [Foundry](https://book.getfoundry.sh/getting-started/installation)
- [Node.js](https://nodejs.org/)
- [MetaMask](https://metamask.io/)

### Local Deployment (Anvil)

1. Start Anvil in a separate terminal:

```bash
anvil
```

2. Deploy the Mock Price Feed:

```bash
forge create src/mocks/MockV3Aggregator.sol:MockV3Aggregator \
 --rpc-url http://localhost:8545 \
 --private-key $TEST_WALLET_PRIVATE_KEY \
 --broadcast \
 --constructor-args 8 200000000000
```

3. Deploy the FundMe Contract:

```bash
forge create src/FundMe.sol:FundMe \
 --rpc-url http://localhost:8545 \
 --private-key $TEST_WALLET_PRIVATE_KEY \
 --broadcast \
 --constructor-args <PRICE_FEED_ADDRESS>
```

Or use the deployment script:

```bash
forge script script/DeployFundMe.s.sol --rpc-url http://localhost:8545 --broadcast --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```

### Connecting to Anvil

1. Add Anvil to MetaMask:

   - Network Name: Anvil
   - RPC URL: http://localhost:8545
   - Chain ID: 31337
   - Currency Symbol: ETH

2. Import a test account from Anvil output (they come with 10,000 ETH)

## Generating ABIs

There are two ways to generate ABIs for your smart contracts using Foundry:

### Method 1: Using forge build

```bash
# Build your contracts and generate ABIs
forge build

# The ABIs will be generated in the out/ directory
# Copy the ABI to your frontend project
cp out/FundMe.sol/FundMe.json foundry/src/abi/
```

### Method 2: Using forge inspect

```bash
# Generate ABI for a specific contract
forge inspect FundMe abi > foundry/src/abi/FundMe.json

# Generate ABIs for all contracts in your project
forge inspect --pretty src/*.sol abi > foundry/src/abi/contracts.json
```

The generated ABI can then be imported into your frontend application:

```typescript
import FUND_ME_ABI from "../../foundry/src/abi/FundMe.json";
```

Note: Make sure to run either command after any changes to your smart contracts to keep the ABI in sync with your contract code.
