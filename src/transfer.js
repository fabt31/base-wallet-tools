const { ethers } = require("ethers");

const ERC20_ABI = [
  "function transfer(address to, uint256 amount) returns (bool)",
  "function balanceOf(address) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
  "function approve(address spender, uint256 amount) returns (bool)",
];

/**
 * Transfer ETH to an address
 */
async function transferETH(wallet, toAddress, amountEth) {
  const value = ethers.utils.parseEther(amountEth.toString());
  const balance = await wallet.provider.getBalance(wallet.address);
  if (balance.lt(value)) throw new Error("Insufficient ETH balance");

  const tx = await wallet.sendTransaction({ to: toAddress, value });
  const receipt = await tx.wait();
  console.log("ETH transfer confirmed. Tx:", receipt.transactionHash);
  return receipt;
}

/**
 * Transfer ERC20 tokens
 */
async function transferERC20(wallet, tokenAddress, toAddress, amount, decimals = null) {
  const token = new ethers.Contract(tokenAddress, ERC20_ABI, wallet);

  if (decimals === null) {
    decimals = await token.decimals();
  }
  const amountWei = ethers.utils.parseUnits(amount.toString(), decimals);
  const balance = await token.balanceOf(wallet.address);
  if (balance.lt(amountWei)) throw new Error("Insufficient token balance");

  const tx = await token.transfer(toAddress, amountWei);
  const receipt = await tx.wait();
  console.log("Token transfer confirmed. Tx:", receipt.transactionHash);
  return receipt;
}

/**
 * Estimate gas cost for an ETH transfer
 */
async function estimateETHTransferGas(provider) {
  const gasPrice = await provider.getGasPrice();
  const gasLimit = 21000;
  const costWei = gasPrice.mul(gasLimit);
  return {
    gasPrice: ethers.utils.formatUnits(gasPrice, "gwei") + " gwei",
    gasLimit,
    costETH: ethers.utils.formatEther(costWei),
  };
}

module.exports = { transferETH, transferERC20, estimateETHTransferGas };
