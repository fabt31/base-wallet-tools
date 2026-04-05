/**
 * export_history.js — Export token transfer history to CSV
 * Usage: node scripts/export_history.js <token_address> <wallet_address> [from_block]
 */
require("dotenv").config();
const { ethers } = require("ethers");
const fs = require("fs");
const { getTransferHistory } = require("../src/events");

async function exportHistory(tokenAddress, walletAddress, fromBlock = 0) {
  const provider = new ethers.providers.JsonRpcProvider(
    process.env.BASE_RPC || "https://mainnet.base.org"
  );

  const tokenABI = ["function symbol() view returns (string)", "function decimals() view returns (uint8)"];
  const token = new ethers.Contract(tokenAddress, tokenABI, provider);
  const [symbol, decimals] = await Promise.all([token.symbol(), token.decimals()]);

  console.log("Fetching history for " + symbol + "...");
  const history = await getTransferHistory(tokenAddress, walletAddress, provider, fromBlock);
  console.log("Found:", history.received.length + " received,", history.sent.length + " sent");

  const rows = [["Type", "From", "To", "Amount", "TxHash", "Block"]];

  for (const event of history.received) {
    rows.push(["RECEIVED", event.args.from, event.args.to,
      ethers.utils.formatUnits(event.args.value, decimals),
      event.transactionHash, event.blockNumber]);
  }

  for (const event of history.sent) {
    rows.push(["SENT", event.args.from, event.args.to,
      ethers.utils.formatUnits(event.args.value, decimals),
      event.transactionHash, event.blockNumber]);
  }

  const csv = rows.map((r) => r.join(",")).join("\n");
  const filename = symbol + "_history_" + walletAddress.slice(0, 8) + ".csv";
  fs.writeFileSync(filename, csv);
  console.log("Saved to:", filename);
}

const [tokenAddress, walletAddress, fromBlock] = process.argv.slice(2);
if (!tokenAddress || !walletAddress) {
  console.error("Usage: node scripts/export_history.js <token_address> <wallet_address> [from_block]");
  process.exit(1);
}
exportHistory(tokenAddress, walletAddress, Number(fromBlock) || 0).catch(console.error);
