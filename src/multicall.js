/**
 * Multicall utility for Base L2
 * Batches multiple read calls into a single RPC request using Multicall3.
 * Multicall3 is deployed at the same address on all EVM chains.
 */

const { ethers } = require("ethers");

// Multicall3 - same address on Base, Ethereum, and most EVM chains
const MULTICALL3_ADDRESS = "0xcA11bde05977b3631167028862bE2a173976CA11";

const MULTICALL3_ABI = [
  "function aggregate3(tuple(address target, bool allowFailure, bytes callData)[] calls) view returns (tuple(bool success, bytes returnData)[] returnData)"
];

/**
 * Batch multiple contract read calls.
 * @param {ethers.Provider} provider
 * @param {Array<{target: string, abi: string[], fn: string, args: any[]}>} calls
 * @returns {Array<any>} decoded results
 */
async function multicall(provider, calls) {
  const mc = new ethers.Contract(MULTICALL3_ADDRESS, MULTICALL3_ABI, provider);

  const encodedCalls = calls.map(({ target, abi, fn, args = [] }) => {
    const iface = new ethers.Interface(abi);
    return {
      target,
      allowFailure: true,
      callData: iface.encodeFunctionData(fn, args)
    };
  });

  const results = await mc.aggregate3(encodedCalls);

  return results.map((result, i) => {
    if (!result.success) return null;
    const iface = new ethers.Interface(calls[i].abi);
    const decoded = iface.decodeFunctionResult(calls[i].fn, result.returnData);
    return decoded.length === 1 ? decoded[0] : decoded;
  });
}

/**
 * Convenience: get ERC20 balances for multiple tokens at once.
 */
async function getMultipleBalances(provider, walletAddress, tokenAddresses) {
  const ERC20_ABI = ["function balanceOf(address) view returns (uint256)"];
  const calls = tokenAddresses.map(token => ({
    target: token,
    abi: ERC20_ABI,
    fn: "balanceOf",
    args: [walletAddress]
  }));
  return multicall(provider, calls);
}

module.exports = { multicall, getMultipleBalances, MULTICALL3_ADDRESS };
