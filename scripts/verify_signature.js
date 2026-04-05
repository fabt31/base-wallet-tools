/**
 * verify_signature.js — Verify an ECDSA signature on Base
 * Usage: node scripts/verify_signature.js <message> <signature>
 */
const { ethers } = require("ethers");

function verifySignature(message, signature) {
  try {
    const recovered = ethers.utils.verifyMessage(message, signature);
    console.log("Message:", message);
    console.log("Signature:", signature);
    console.log("Signer:", recovered);
    return recovered;
  } catch (e) {
    console.error("Invalid signature:", e.message);
    return null;
  }
}

function verifySignatureForAddress(message, signature, expectedAddress) {
  const signer = verifySignature(message, signature);
  if (!signer) return false;
  const match = signer.toLowerCase() === expectedAddress.toLowerCase();
  console.log("Expected:", expectedAddress);
  console.log("Match:", match);
  return match;
}

const message = process.argv[2];
const signature = process.argv[3];
const expected = process.argv[4];

if (!message || !signature) {
  console.error("Usage: node scripts/verify_signature.js <message> <signature> [expectedAddress]");
  process.exit(1);
}

if (expected) {
  verifySignatureForAddress(message, signature, expected);
} else {
  verifySignature(message, signature);
}
