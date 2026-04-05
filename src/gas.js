const { ethers } = require("ethers");

/**
 * Get current EIP-1559 gas parameters from Base network
 */
async function getGasParams(provider) {
  const block = await provider.getBlock("latest");
  const baseFee = block.baseFeePerGas || ethers.BigNumber.from(0);
  const maxPriorityFee = await provider.send("eth_maxPriorityFeePerGas", []);
  const priorityFee = ethers.BigNumber.from(maxPriorityFee);
  const maxFee = baseFee.mul(2).add(priorityFee);

  return {
    baseFee,
    maxPriorityFeePerGas: priorityFee,
    maxFeePerGas: maxFee,
    baseFeeGwei: ethers.utils.formatUnits(baseFee, "gwei"),
    maxFeeGwei: ethers.utils.formatUnits(maxFee, "gwei"),
  };
}

/**
 * Estimate gas for a transaction
 */
async function estimateGas(provider, txParams) {
  const estimate = await provider.estimateGas(txParams);
  const gasParams = await getGasParams(provider);
  const costWei = estimate.mul(gasParams.maxFeePerGas);
  return {
    gasLimit: estimate,
    costWei,
    costETH: ethers.utils.formatEther(costWei),
    costGwei: ethers.utils.formatUnits(costWei, "gwei"),
  };
}

/**
 * Get gas price with a multiplier for faster confirmation
 */
async function getGasPriceWithMultiplier(provider, multiplier = 1.2) {
  const gasParams = await getGasParams(provider);
  const adjusted = gasParams.maxFeePerGas.mul(Math.round(multiplier * 100)).div(100);
  return adjusted;
}

module.exports = { getGasParams, estimateGas, getGasPriceWithMultiplier };
