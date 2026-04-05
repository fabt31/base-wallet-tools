const { ethers } = require("ethers");

/**
 * Make a generic read call to any contract
 */
async function callContract(address, abi, method, args = [], provider) {
  const contract = new ethers.Contract(address, abi, provider);
  return contract[method](...args);
}

/**
 * Make a write call to any contract (requires a wallet)
 */
async function sendToContract(address, abi, method, args = [], wallet, overrides = {}) {
  const contract = new ethers.Contract(address, abi, wallet);
  const tx = await contract[method](...args, overrides);
  const receipt = await tx.wait();
  return receipt;
}

/**
 * Encode function call data
 */
function encodeCall(abi, method, args = []) {
  const iface = new ethers.utils.Interface(abi);
  return iface.encodeFunctionData(method, args);
}

/**
 * Decode return data from a call
 */
function decodeReturn(abi, method, data) {
  const iface = new ethers.utils.Interface(abi);
  return iface.decodeFunctionResult(method, data);
}

/**
 * Check if an address is a contract (has code)
 */
async function isContract(address, provider) {
  const code = await provider.getCode(address);
  return code !== "0x";
}

module.exports = { callContract, sendToContract, encodeCall, decodeReturn, isContract };
