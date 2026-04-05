const { ethers } = require("ethers");

/**
 * Send ETH to multiple addresses
 * @param {ethers.Wallet} wallet - Connected wallet
 * @param {Array<{to: string, amount: string}>} transfers - Array of {to, amount in ETH}
 */
async function batchETHTransfer(wallet, transfers) {
  const results = [];
  let nonce = await wallet.provider.getTransactionCount(wallet.address);

  for (const { to, amount } of transfers) {
    try {
      const value = ethers.utils.parseEther(amount.toString());
      const tx = await wallet.sendTransaction({ to, value, nonce });
      results.push({ to, amount, txHash: tx.hash, status: "sent" });
      nonce++;
      console.log("Sent " + amount + " ETH to " + to + " | Tx: " + tx.hash);
    } catch (e) {
      results.push({ to, amount, error: e.message, status: "failed" });
      console.error("Failed to send to " + to + ":", e.message);
    }
  }

  console.log("\nWaiting for confirmations...");
  const hashes = results.filter((r) => r.txHash).map((r) => r.txHash);
  for (const hash of hashes) {
    await wallet.provider.waitForTransaction(hash, 1);
  }
  return results;
}

/**
 * Send ERC20 tokens to multiple addresses
 */
async function batchTokenTransfer(wallet, tokenAddress, transfers, decimals = 18) {
  const abi = ["function transfer(address to, uint256 amount) returns (bool)"];
  const token = new ethers.Contract(tokenAddress, abi, wallet);
  const results = [];
  let nonce = await wallet.provider.getTransactionCount(wallet.address);

  for (const { to, amount } of transfers) {
    try {
      const amountWei = ethers.utils.parseUnits(amount.toString(), decimals);
      const tx = await token.transfer(to, amountWei, { nonce });
      results.push({ to, amount, txHash: tx.hash, status: "sent" });
      nonce++;
    } catch (e) {
      results.push({ to, amount, error: e.message, status: "failed" });
    }
  }
  return results;
}

module.exports = { batchETHTransfer, batchTokenTransfer };
