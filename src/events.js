const { ethers } = require("ethers");

const ERC20_TRANSFER_ABI = ["event Transfer(address indexed from, address indexed to, uint256 value)"];
const ERC721_TRANSFER_ABI = ["event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)"];

/**
 * Watch for incoming ETH transactions to an address
 */
function watchETHIncoming(address, provider, callback) {
  console.log("Watching for incoming ETH to:", address);
  provider.on("block", async (blockNumber) => {
    const block = await provider.getBlockWithTransactions(blockNumber);
    const incoming = block.transactions.filter(
      (tx) => tx.to && tx.to.toLowerCase() === address.toLowerCase()
    );
    for (const tx of incoming) {
      callback({
        type: "ETH",
        from: tx.from,
        to: tx.to,
        amount: ethers.utils.formatEther(tx.value),
        txHash: tx.hash,
        blockNumber,
      });
    }
  });
}

/**
 * Watch for ERC20 Transfer events from/to an address
 */
function watchERC20Transfers(tokenAddress, address, provider, callback) {
  const contract = new ethers.Contract(tokenAddress, ERC20_TRANSFER_ABI, provider);
  const filter = contract.filters.Transfer(null, address);
  console.log("Watching ERC20 transfers to:", address);
  contract.on(filter, (from, to, value, event) => {
    callback({
      type: "ERC20",
      token: tokenAddress,
      from,
      to,
      value: value.toString(),
      txHash: event.transactionHash,
    });
  });
  return () => contract.removeAllListeners();
}

/**
 * Get historical ERC20 Transfer events
 */
async function getTransferHistory(tokenAddress, address, provider, fromBlock = 0) {
  const contract = new ethers.Contract(tokenAddress, ERC20_TRANSFER_ABI, provider);
  const filterReceived = contract.filters.Transfer(null, address);
  const filterSent = contract.filters.Transfer(address, null);
  const [received, sent] = await Promise.all([
    contract.queryFilter(filterReceived, fromBlock),
    contract.queryFilter(filterSent, fromBlock),
  ]);
  return { received, sent, all: [...received, ...sent].sort((a, b) => a.blockNumber - b.blockNumber) };
}

module.exports = { watchETHIncoming, watchERC20Transfers, getTransferHistory };
