const { ethers } = require("ethers");

/**
 * Generate a new random HD wallet
 */
function generateWallet() {
  const wallet = ethers.Wallet.createRandom();
  return {
    address: wallet.address,
    privateKey: wallet.privateKey,
    mnemonic: wallet.mnemonic.phrase,
  };
}

/**
 * Derive a wallet from a mnemonic at a specific path
 */
function fromMnemonic(mnemonic, index = 0) {
  const path = "m/44'/60'/0'/0/" + index;
  const wallet = ethers.Wallet.fromMnemonic(mnemonic, path);
  return { address: wallet.address, privateKey: wallet.privateKey, path };
}

/**
 * Derive multiple wallets from a single mnemonic
 */
function deriveWallets(mnemonic, count = 5) {
  return Array.from({ length: count }, (_, i) => fromMnemonic(mnemonic, i));
}

/**
 * Create a wallet from private key and connect to Base
 */
function connectToBase(privateKey, rpc = "https://mainnet.base.org") {
  const provider = new ethers.providers.JsonRpcProvider(rpc);
  return new ethers.Wallet(privateKey, provider);
}

/**
 * Check if a string is a valid Ethereum address
 */
function isValidAddress(address) {
  try {
    ethers.utils.getAddress(address);
    return true;
  } catch {
    return false;
  }
}

module.exports = { generateWallet, fromMnemonic, deriveWallets, connectToBase, isValidAddress };
