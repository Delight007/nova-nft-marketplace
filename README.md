# Solana (NOVA) NFT Marketplace Protocol

A Solana-native NFT marketplace protocol built with **Rust, Anchor, and Next.js**, designed to enable users to explore, list, buy, and sell NFTs on the Solana blockchain.

The project aims to provide a decentralized marketplace experience with secure on-chain transactions, NFT metadata integration, and a modern user interface.

> **Status:** 🚧 Under active development. The initial marketplace program instruction has been implemented and tested. Core marketplace features are being built incrementally.

## Overview

The Solana NFT Marketplace Protocol is a decentralized application focused on NFT discovery and trading on Solana. It combines an on-chain program for marketplace operations with a modern frontend for interacting with digital assets.

The protocol is being developed with an emphasis on security, transparency, and a user-friendly experience while leveraging Solana's high-performance blockchain infrastructure.

## Features

### Implemented

- [x] Solana and Anchor development environment setup
- [x] Marketplace account initialization instruction
- [x] Marketplace authority and treasury configuration
- [x] Marketplace fee basis-points configuration
- [x] PDA-based marketplace account
- [x] Tests for successful initialization and invalid marketplace fees

### In Development

- [x] Frontend project setup
- [x] Explore NFTs page — UI development
- [ ] NFT listing and delisting instructions
- [ ] NFT purchase and sale execution
- [ ] Secure on-chain payment handling
- [ ] Marketplace fee collection
- [ ] NFT metadata integration
- [ ] Wallet connection and transaction signing
- [ ] Backend indexing and marketplace data APIs
- [ ] NFT search, filtering, and sorting
- [ ] Unit and integration tests for trading operations
- [ ] Devnet deployment and end-to-end testing

## Tech Stack

**Blockchain**
- Solana
- Rust
- Anchor Framework

**Frontend**
- Next.js
- React
- TypeScript
- Tailwind CSS
- Material UI components where needed

**Backend and Data** *(planned)*
- Node.js
- Express
- TypeScript
- PostgreSQL
- Prisma ORM

**NFT Storage and Metadata** *(planned)*
- IPFS
- Arweave

**Payments**
- SOL
- USDC support planned

## Project Structure

```text
solana-nft-marketplace/
├── marketplace/
│   ├── programs/
│   │   └── marketplace/
│   │       └── src/
│   │           ├── lib.rs
│   │           ├── constants.rs
│   │           ├── error.rs
│   │           ├── instructions.rs
│   │           ├── state.rs
│   │           └── instructions/
│   │               └── initialize_marketplace.rs
│   ├── tests/
│   ├── Anchor.toml
│   └── Cargo.toml
└── frontend/
    ├── app/
    ├── components/
    ├── public/
    └── package.json
```

*The structure above illustrates the main project areas; additional files may be added as development progresses.*

## Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/)
- [Rust](https://www.rust-lang.org/tools/install)
- [Solana CLI](https://solana.com/docs/intro/installation)
- [Anchor Framework](https://www.anchor-lang.com/docs/installation)
- [Yarn](https://yarnpkg.com/) or your preferred package manager

### 1. Clone the Repository

```bash
git clone https://github.com/Delight007/solana-nft-marketplace.git
cd solana-nft-marketplace
```

### 2. Build the Solana Program

```bash
cd marketplace
anchor build
```

### 3. Run the Program Tests

```bash
cargo test
```

Run the Anchor test suite when configured for your local environment:

```bash
anchor test
```

The current Rust tests cover marketplace initialization and rejection of invalid fee configurations.

### 4. Start the Frontend

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Smart Contract Design

The marketplace program is built with Anchor and uses Program Derived Addresses (PDAs) to manage marketplace state.

### Marketplace Initialization

The initialization instruction creates a marketplace account containing:

- **Authority:** The public key responsible for marketplace administration.
- **Treasury:** The public key designated to receive marketplace fees.
- **Fee basis points:** The marketplace fee configuration, expressed in basis points.

The marketplace account uses the `marketplace` PDA seed and is initialized through an Anchor instruction.

For example, a fee of 250 basis points represents a 2.5% fee.

### Planned Marketplace Operations

The protocol is intended to support:

- NFT listing and delisting
- Secure NFT custody or escrow where required
- NFT purchases and seller payments
- Marketplace fee collection
- On-chain validation of trading conditions

These operations will be implemented and tested before the protocol is considered complete.

## Development Roadmap

### Phase 1 — Foundation
- [x] Initialize the Rust and Anchor project
- [x] Define marketplace state
- [x] Implement marketplace initialization
- [x] Add initialization tests
- [x] Set up the Next.js frontend

### Phase 2 — Marketplace Program
- [ ] Implement NFT listing
- [ ] Implement NFT delisting
- [ ] Implement NFT purchasing
- [ ] Implement seller payment settlement
- [ ] Implement marketplace fee collection
- [ ] Add authorization and account validation
- [ ] Test transaction security and edge cases

### Phase 3 — Frontend Experience
- [x] Build the initial Explore NFTs page UI
- [ ] Integrate Solana wallet adapters
- [ ] Connect frontend actions to program instructions
- [ ] Implement listing and purchasing interfaces
- [ ] Add search, filtering, sorting, and NFT detail pages
- [ ] Display transaction status and errors

### Phase 4 — Backend and Indexing
- [ ] Design the database schema
- [ ] Set up PostgreSQL and Prisma
- [ ] Implement NFT and marketplace data indexing
- [ ] Build APIs for marketplace discovery
- [ ] Integrate NFT metadata storage and retrieval

### Phase 5 — Testing and Deployment
- [ ] Complete program unit and integration tests
- [ ] Test complete listing and purchasing flows
- [ ] Deploy the program to Solana Devnet
- [ ] Conduct security and account-validation reviews
- [ ] Prepare mainnet deployment

## Security Considerations

Security is a core requirement of the protocol. Development will prioritize:

- Validating account ownership and signer permissions
- Enforcing marketplace authority rules
- Validating NFT mint and token accounts
- Preventing unauthorized withdrawals and transfers
- Correctly calculating marketplace fees
- Protecting against replay, duplicate listings, and invalid purchase states
- Testing transaction rollback and edge cases

The marketplace should not be considered production-ready until its trading instructions have been implemented, tested, and reviewed.

## Contributing

Contributions, suggestions, and feedback are welcome.

1. Fork the repository.
2. Create a feature branch.
3. Implement your changes and add appropriate tests.
4. Commit your changes with a descriptive message.
5. Open a pull request.

## Disclaimer

This project is under active development and is intended for educational and development purposes. Features described as planned or in development are not yet guaranteed to be available. Do not use real funds or rely on the protocol for production transactions.

## License

A license has not yet been specified. Licensing terms will be added when the project license is selected.

---

**Built with Rust, Anchor, and Solana.**

