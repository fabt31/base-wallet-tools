const { ethers } = require("ethers");

const ERC20_ABI = [
  "function balanceOf(address) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
  "function name() view returns (string)",
];

const BASE_TOKENS = {
  WETH: "0x4200000000000000000000000000000000000006",
  USDC: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
  USDbC: "0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA",
  DAI: "0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb",
  cbETH: "0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22",
  AERO: "0x940181a94A35A4569E4529A3CDfB74e38FD98631",
};

/**
 * Get ETH balance for an address
 */
async function getETHBalance(address, provider) {
  const balance = await provider.getBalance(address);
  return { raw: balance, formatted: ethers.utils.formatEther(balance) };
}

/**
 * Get ERC20 token balance
 */
async function getTokenBalance(address, tokenAddress, provider) {
  const contract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);
  const [balance, decimals, symbol, name] = await Promise.all([
    contract.balanceOf(address),
    contract.decimals(),
    contract.symbol(),
    contract.name(),
  ]);
  return {
    address: tokenAddress,
    symbol,
    name,
    raw: balance,
    formatted: ethers.utils.formatUnits(balance, decimals),
    decimals,
  };
}

/**
 * Get all common Base token balances for an address
 */
async function getAllBalances(address, provider, customTokens = {}) {
  const allTokens = { ...BASE_TOKENS, ...customTokens };
  const results = { ETH: await getETHBalance(address, provider) };

  await Promise.allSettled(
    Object.entries(allTokens).map(async ([name, addr]) => {
      try {
        results[name] = await getTokenBalance(address, addr, provider);
      } catch (e) {
        results[name] = { error: e.message };
      }
    })
  );
  return results;
}

/**
 * Print a formatted balance report
 */
async function printBalanceReport(address, provider) {
  const balances = await getAllBalances(address, provider);
  console.log("\nBalance Report for:", address);
  console.log("=".repeat(50));
  console.log("ETH:", parseFloat(balances.ETH.formatted).toFixed(6));
  for (const [symbol, info] of Object.entries(balances)) {
    if (symbol === "ETH") continue;
    if (info.error) continue;
    const amount = parseFloat(info.formatted);
    if (amount > 0) console.log(symbol + ":", amount.toFixed(6));
  }
  console.log("=".repeat(50));
}

module.exports = { getETHBalance, getTokenBalance, getAllBalances, printBalanceReport, BASE_TOKENS };
