# base-wallet-tools API Reference

## src/wallet.js

### `generateWallet()`
Generates a new random Ethereum wallet.
- **Returns:** `{ address, privateKey, mnemonic }`

### `fromMnemonic(mnemonic)`
Derives a wallet from a BIP-39 mnemonic phrase.
- **Params:** `mnemonic` (string) — 12 or 24 word phrase
- **Returns:** `ethers.HDNodeWallet`

### `deriveWallets(mnemonic, count)`
Derives multiple wallets from a mnemonic using BIP-44 derivation path `m/44'/60'/0'/0/i`.
- **Params:** `mnemonic`, `count` (number)
- **Returns:** Array of `{ index, address, privateKey }`

### `connectToBase(privateKey)`
Connects a wallet to Base mainnet.
- **Returns:** `ethers.Wallet` connected to Base RPC

### `isValidAddress(address)`
Checks if a string is a valid Ethereum address.
- **Returns:** `boolean`

---

## src/balance.js

### `getETHBalance(provider, address)`
Fetches ETH balance for an address.
- **Returns:** `{ raw: bigint, formatted: string }`

### `getTokenBalance(provider, tokenAddress, walletAddress)`
Fetches ERC20 token balance.
- **Returns:** `{ raw: bigint, formatted: string, symbol: string, decimals: number }`

### `getAllBalances(provider, walletAddress)`
Fetches ETH + all tracked Base token balances.
- **Returns:** Array of balance objects

### `printBalanceReport(provider, walletAddress)`
Prints a formatted balance report to stdout.

---

## src/transfer.js

### `transferETH(signer, toAddress, amountEth)`
Sends ETH with EIP-1559 gas estimation.
- **Returns:** transaction receipt

### `transferERC20(signer, tokenAddress, toAddress, amount)`
Sends an ERC20 token.
- **Returns:** transaction receipt

### `estimateETHTransferGas(provider, from, to)`
Estimates gas for an ETH transfer.
- **Returns:** `bigint`

---

## src/multicall.js

### `multicall(provider, calls)`
Batches multiple read calls via Multicall3.
- **Params:** `calls` — array of `{ target, abi, fn, args }`
- **Returns:** array of decoded results

### `getMultipleBalances(provider, walletAddress, tokenAddresses)`
Batch-reads ERC20 balances for multiple tokens.
- **Returns:** array of `bigint` balances

---

## src/permit.js

### `signPermit(signer, tokenAddress, spenderAddress, amount, deadlineSeconds)`
Signs an EIP-2612 permit off-chain.
- **Returns:** `{ v, r, s, deadline, owner, spender, value }`

### `executePermit(signer, tokenAddress, permitData)`
Submits a signed permit on-chain.
- **Returns:** transaction

---

## src/gas.js

### `getGasParams(provider)`
Returns EIP-1559 gas parameters `{ maxFeePerGas, maxPriorityFeePerGas }`.

### `estimateGas(provider, tx)`
Estimates gas for a transaction.

### `getGasPriceWithMultiplier(provider, multiplier)`
Returns gas price with a safety multiplier (e.g. 1.2 for 20% buffer).

---

## utils/units.js

| Function | Description |
|---|---|
| `toWei(eth)` | Convert ETH string to wei bigint |
| `fromWei(wei)` | Convert wei bigint to ETH string |
| `toTokenUnits(amount, decimals)` | Human amount to raw bigint |
| `fromTokenUnits(raw, decimals)` | Raw bigint to human string |
| `formatGwei(wei)` | Format wei as Gwei string |
| `hexToNumber(hex)` | Hex string to number |

---

## utils/address.js

| Function | Description |
|---|---|
| `checksumAddress(addr)` | EIP-55 checksum an address |
| `addressesEqual(a, b)` | Case-insensitive address comparison |
| `shortenAddress(addr)` | Returns `0x1234...abcd` format |
| `isZeroAddress(addr)` | Returns true if address is 0x000...0 |
| `basescanUrl(addr)` | Basescan address URL |
| `basescanTxUrl(hash)` | Basescan transaction URL |
