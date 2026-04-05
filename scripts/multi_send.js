/**
 * multi_send.js — Distribute ETH to multiple addresses from a file
 * Usage: node scripts/multi_send.js recipients.json
 *
 * recipients.json format:
 * [
 *   { "address": "0x...", "amount": "0.01" },
 *   { "address": "0x...", "amount": "0.005" }
 * ]
 */
require("dotenv").config();
const { ethers } = require("ethers");
const fs = require("fs");
const { batchETHTransfer } = require("../src/batch_transfer");

async function multiSend(recipientsFile) {
  const recipients = JSON.parse(fs.readFileSync(recipientsFile, "utf8"));
  console.log("Recipients loaded:", recipients.length);

  const provider = new ethers.providers.JsonRpcProvider(
    process.env.BASE_RPC || "https://mainnet.base.org"
  );
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  console.log("Sending from:", wallet.address);

  const totalETH = recipients.reduce((sum, r) => sum + parseFloat(r.amount), 0);
  console.log("Total ETH to send:", totalETH.toFixed(6));

  const balance = await provider.getBalance(wallet.address);
  const balanceETH = parseFloat(ethers.utils.formatEther(balance));
  if (balanceETH < totalETH) {
    throw new Error("Insufficient balance: have " + balanceETH + " ETH, need " + totalETH + " ETH");
  }

  const transfers = recipients.map((r) => ({ to: r.address, amount: r.amount }));
  console.log("\nSending...");
  const results = await batchETHTransfer(wallet, transfers);

  const succeeded = results.filter((r) => r.status === "sent").length;
  const failed = results.filter((r) => r.status === "failed").length;
  console.log("\nResults: " + succeeded + " sent, " + failed + " failed");

  fs.writeFileSync("multi_send_results.json", JSON.stringify(results, null, 2));
  console.log("Results saved to multi_send_results.json");
}

const file = process.argv[2];
if (!file) {
  console.error("Usage: node scripts/multi_send.js <recipients.json>");
  process.exit(1);
}
multiSend(file).catch(console.error);
