# base-wallet-tools

Wallet utilities and automation tools for interacting with Base L2. Includes balance checking, token transfers, batch operations, event monitoring, and more.

## Tools

| Tool | Description |
|------|-------------|
| `src/wallet.js` | HD wallet generation and management |
| `src/balance.js` | Multi-token balance checker |
| `src/transfer.js` | ETH and ERC20 transfers |
| `src/batch_transfer.js` | Send tokens to multiple addresses |
| `src/events.js` | Subscribe to on-chain events |
| `scripts/check_wallet.js` | Full wallet audit |
| `scripts/watch_address.js` | Monitor address in real-time |
| `scripts/multi_send.js` | Batch ETH distribution |

## Requirements

- Node.js >= 16
- npm >= 8

## Setup

```bash
npm install
cp .env.example .env
```

## Network

Targets **Base Mainnet** (chainId: 8453) and **Base Sepolia** (chainId: 84532).

> Use responsibly. Never share private keys.
