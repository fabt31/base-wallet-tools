/**
 * watch_address.js — Monitor an address for incoming transactions on Base
 * Usage: node scripts/watch_address.js <address>
 */
require("dotenv").config();
const { ethers } = require("ethers");
const { watchETHIncoming, watchERC20Transfers } = require("../src/events");

const RPC_WS = process.env.BASE_WS_RPC || "wss://base-mainnet.g.alchemy.com/v2/" + (process.env.ALCHEMY_KEY || "demo");
const RPC_HTTP = process.env.BASE_RPC || "https://mainnet.base.org";

const USDC = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";
const WETH = "0x4200000000000000000000000000000000000006";

async function watchAddress(address) {
  const addr = ethers.utils.getAddress(address);
  console.log("Watching address:", addr);
  console.log("Press Ctrl+C to stop\n");

  // Use HTTP provider for polling if no WebSocket available
  const provider = new ethers.providers.JsonRpcProvider(RPC_HTTP);

  watchETHIncoming(addr, provider, (event) => {
    console.log("[ETH INCOMING]", {
      from: event.from,
      amount: event.amount + " ETH",
      tx: event.txHash,
      block: event.blockNumber,
    });
  });

  watchERC20Transfers(USDC, addr, provider, (event) => {
    console.log("[USDC INCOMING]", {
      from: event.from,
      value: ethers.utils.formatUnits(event.value, 6) + " USDC",
      tx: event.txHash,
    });
  });

  watchERC20Transfers(WETH, addr, provider, (event) => {
    console.log("[WETH INCOMING]", {
      from: event.from,
      value: ethers.utils.formatEther(event.value) + " WETH",
      tx: event.txHash,
    });
  });

  console.log("Monitoring started...");
  await new Promise(() => {}); // keep alive
}

const address = process.argv[2] || process.env.WALLET_ADDRESS;
if (!address) {
  console.error("Usage: node scripts/watch_address.js <address>");
  process.exit(1);
}
watchAddress(address).catch(console.error);
