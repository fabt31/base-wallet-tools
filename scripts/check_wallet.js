/**
 * check_wallet.js — Comprehensive wallet audit for Base L2
 * Usage: node scripts/check_wallet.js [address]
 */
require("dotenv").config();
const { ethers } = require("ethers");
const { printBalanceReport, BASE_TOKENS } = require("../src/balance");

const RPC = process.env.BASE_RPC || "https://mainnet.base.org";

async function checkWallet(address) {
  const provider = new ethers.providers.JsonRpcProvider(RPC);
  const addr = ethers.utils.getAddress(address);

  console.log("\n" + "=".repeat(60));
  console.log("Base L2 Wallet Audit");
  console.log("=".repeat(60));
  console.log("Address:", addr);
  console.log("Network: Base Mainnet (chainId: 8453)");
  console.log("Time:", new Date().toISOString());
  console.log("=".repeat(60));

  // Nonce (tx count)
  const nonce = await provider.getTransactionCount(addr);
  console.log("\nTransaction count:", nonce);

  // Balances
  await printBalanceReport(addr, provider);

  // Gas estimate for a simple transfer
  const gasPrice = await provider.getGasPrice();
  const gasCostETH = ethers.utils.formatEther(gasPrice.mul(21000));
  console.log("Simple transfer cost:", gasCostETH, "ETH (" + ethers.utils.formatUnits(gasPrice, "gwei") + " gwei)");
}

const address = process.argv[2] || process.env.WALLET_ADDRESS;
if (!address) {
  console.error("Usage: node scripts/check_wallet.js <address>");
  process.exit(1);
}
checkWallet(address).catch(console.error);
