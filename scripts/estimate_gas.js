/**
 * estimate_gas.js — Estimate gas cost on Base
 * Usage: node scripts/estimate_gas.js [tx_type]
 * tx_type: transfer | erc20 | contract_deploy
 */
require("dotenv").config();
const { ethers } = require("ethers");

const GAS_LIMITS = {
  "eth_transfer": 21000,
  "erc20_transfer": 65000,
  "erc20_approve": 50000,
  "uniswap_swap": 180000,
  "nft_mint": 150000,
  "contract_deploy": 2000000,
  "aave_supply": 280000,
  "aerodrome_swap": 250000,
};

async function estimateGasCosts(ethPriceUSD = 3000) {
  const provider = new ethers.providers.JsonRpcProvider(
    process.env.BASE_RPC || "https://mainnet.base.org"
  );

  const block = await provider.getBlock("latest");
  const baseFee = block.baseFeePerGas;
  const priorityFee = ethers.utils.parseUnits("0.001", "gwei");
  const maxFee = baseFee.add(priorityFee);

  console.log("\nBase Fee:", ethers.utils.formatUnits(baseFee, "gwei"), "gwei");
  console.log("Max Fee:", ethers.utils.formatUnits(maxFee, "gwei"), "gwei");
  console.log("\nTransaction Cost Estimates (at", ethers.utils.formatUnits(maxFee, "gwei"), "gwei):");
  console.log("=".repeat(55));

  for (const [type, gasLimit] of Object.entries(GAS_LIMITS)) {
    const costWei = maxFee.mul(gasLimit);
    const costETH = parseFloat(ethers.utils.formatEther(costWei));
    const costUSD = costETH * ethPriceUSD;
    console.log(type.padEnd(25), "$" + costUSD.toFixed(4).padStart(8), "(", costETH.toFixed(8), "ETH )");
  }
}

const ethPrice = parseFloat(process.argv[2] || "3000");
estimateGasCosts(ethPrice).catch(console.error);
