const { ethers } = require("ethers");

/**
 * Convert ETH to wei
 */
const toWei = (eth) => ethers.utils.parseEther(eth.toString());

/**
 * Convert wei to ETH
 */
const fromWei = (wei) => ethers.utils.formatEther(wei);

/**
 * Convert token amount to raw units given decimals
 */
const toTokenUnits = (amount, decimals) => ethers.utils.parseUnits(amount.toString(), decimals);

/**
 * Convert raw token units to human-readable
 */
const fromTokenUnits = (raw, decimals) => ethers.utils.formatUnits(raw, decimals);

/**
 * Format gwei value nicely
 */
const formatGwei = (wei) => ethers.utils.formatUnits(wei, "gwei") + " gwei";

/**
 * Convert hex string to number
 */
const hexToNumber = (hex) => parseInt(hex, 16);

/**
 * Pad hex value to 32 bytes
 */
const padHex = (hex) => ethers.utils.hexZeroPad(hex, 32);

/**
 * Encode ABI packed parameters
 */
const encodePacked = (...args) => ethers.utils.solidityPack(...args);

module.exports = {
  toWei,
  fromWei,
  toTokenUnits,
  fromTokenUnits,
  formatGwei,
  hexToNumber,
  padHex,
  encodePacked,
};
