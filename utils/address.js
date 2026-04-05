const { ethers } = require("ethers");

/**
 * Checksum an Ethereum address
 */
function checksumAddress(address) {
  return ethers.utils.getAddress(address);
}

/**
 * Check if two addresses are equal (case-insensitive)
 */
function addressesEqual(a, b) {
  try {
    return ethers.utils.getAddress(a) === ethers.utils.getAddress(b);
  } catch {
    return false;
  }
}

/**
 * Shorten an address for display: 0x1234...5678
 */
function shortenAddress(address, chars = 4) {
  const checksum = ethers.utils.getAddress(address);
  return checksum.slice(0, 2 + chars) + "..." + checksum.slice(-chars);
}

/**
 * Check if address is zero address
 */
function isZeroAddress(address) {
  return address === ethers.constants.AddressZero;
}

/**
 * Generate Basescan URL for an address
 */
function basescanUrl(address, isTestnet = false) {
  const base = isTestnet ? "https://sepolia.basescan.org" : "https://basescan.org";
  return base + "/address/" + address;
}

/**
 * Generate Basescan TX URL
 */
function basescanTxUrl(txHash, isTestnet = false) {
  const base = isTestnet ? "https://sepolia.basescan.org" : "https://basescan.org";
  return base + "/tx/" + txHash;
}

module.exports = { checksumAddress, addressesEqual, shortenAddress, isZeroAddress, basescanUrl, basescanTxUrl };
