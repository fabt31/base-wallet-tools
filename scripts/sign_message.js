/**
 * sign_message.js — Sign an arbitrary message with a Base wallet
 * Usage: node scripts/sign_message.js "message to sign"
 */
require("dotenv").config();
const { ethers } = require("ethers");

async function signMessage(message) {
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY);
  console.log("Signing address:", wallet.address);
  console.log("Message:", message);

  const signature = await wallet.signMessage(message);
  console.log("\nSignature:", signature);

  // Verify
  const recovered = ethers.utils.verifyMessage(message, signature);
  console.log("Recovered address:", recovered);
  console.log("Signature valid:", recovered.toLowerCase() === wallet.address.toLowerCase());

  return { address: wallet.address, message, signature };
}

const message = process.argv[2] || "Hello from Base L2!";
signMessage(message).catch(console.error);
