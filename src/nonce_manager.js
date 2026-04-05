const { ethers } = require("ethers");

/**
 * Simple nonce manager to avoid nonce conflicts when sending
 * multiple transactions in quick succession.
 */
class NonceManager {
  constructor(wallet) {
    this.wallet = wallet;
    this.nonce = null;
    this.pending = 0;
  }

  async init() {
    this.nonce = await this.wallet.provider.getTransactionCount(this.wallet.address, "latest");
    this.pending = 0;
    return this.nonce;
  }

  async getNext() {
    if (this.nonce === null) await this.init();
    const next = this.nonce + this.pending;
    this.pending++;
    return next;
  }

  confirm() {
    this.pending = Math.max(0, this.pending - 1);
    this.nonce++;
  }

  async reset() {
    await this.init();
  }

  async sendTransaction(txParams) {
    const nonce = await this.getNext();
    try {
      const tx = await this.wallet.sendTransaction({ ...txParams, nonce });
      this.confirm();
      return tx;
    } catch (e) {
      await this.reset();
      throw e;
    }
  }
}

/**
 * Get pending transaction count (in mempool)
 */
async function getPendingNonce(address, provider) {
  return provider.getTransactionCount(address, "pending");
}

module.exports = { NonceManager, getPendingNonce };
