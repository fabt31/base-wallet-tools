# Security Policy

## Supported Versions

| Version | Supported |
|---------|----------|
| 1.x     | ✅ Yes   |
| 0.x     | ❌ No    |

## Reporting a Vulnerability

If you discover a security vulnerability in `base-wallet-tools`, please report it responsibly:

1. **Do not** open a public GitHub issue.
2. Email the maintainer at `security@example.com` with the subject line: `[base-wallet-tools] Security Vulnerability`.
3. Include a detailed description, steps to reproduce, and potential impact.

You will receive an acknowledgment within 48 hours and a resolution plan within 7 days.

## Security Considerations

### Private Key Handling

- **Never** commit private keys or mnemonics to version control.
- Always load keys from environment variables (`.env`) or a secrets manager.
- Use `.gitignore` to exclude `.env` files from your repository.

### RPC Endpoint Security

- Avoid exposing API keys (Alchemy, Infura, etc.) in client-side code.
- Use environment variables for all RPC URLs that include API keys.
- Consider using a backend proxy to hide RPC endpoints from end users.

### Transaction Signing

- Always verify transaction parameters (recipient, amount, gas) before signing.
- Use hardware wallets for production/mainnet transactions where possible.
- The `batchTransfer` functions send multiple transactions — double-check recipient arrays.

### Dependencies

- Keep `ethers.js` and other dependencies up to date.
- Run `npm audit` regularly to check for known vulnerabilities.
- Pin dependency versions in production environments.

## Known Limitations

- This library is **not audited** and intended for development/educational use.
- No warranty is provided. Use at your own risk on mainnet.
- The `NonceManager` does not handle concurrent requests across multiple processes.

## Disclaimer

This software is provided as-is. The authors are not responsible for any loss of funds resulting from the use of this library. Always test on testnets before using on mainnet.
