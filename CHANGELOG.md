# Changelog

All notable changes documented here.

## [1.2.0] - 2024-03-15

### Added
- `src/gas.js` - EIP-1559 gas estimation utilities
- `src/contract_call.js` - Generic contract interaction helpers
- `src/index.js` - Barrel export for all modules
- `utils/address.js` - Address validation and formatting
- `utils/units.js` - ETH/token unit conversion
- `scripts/export_history.js` - CSV export of transfer history
- `scripts/estimate_gas.js` - Gas cost estimator for common operations

## [1.1.0] - 2024-02-20

### Added
- `src/nonce_manager.js` - Nonce management for concurrent txs
- `scripts/sign_message.js` - Message signing tool
- `scripts/verify_signature.js` - Signature verification tool
- `config/networks.json` - Network configurations

## [1.0.0] - 2024-01-10

### Added
- `src/wallet.js` - HD wallet generation and management
- `src/balance.js` - Multi-token balance checker
- `src/transfer.js` - ETH and ERC20 transfers
- `src/batch_transfer.js` - Batch send operations
- `src/events.js` - On-chain event monitoring
- `scripts/check_wallet.js` - Full wallet audit
- `scripts/watch_address.js` - Real-time address monitoring
- `scripts/multi_send.js` - Batch ETH distribution
