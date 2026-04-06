/**
 * EIP-2612 Permit signing for Base L2
 * Allows gasless token approvals — sign off-chain, submit on-chain.
 * Compatible with USDC, DAI, and other permit-enabled ERC20s on Base.
 */

const { ethers } = require("ethers");

const ERC20_PERMIT_ABI = [
  "function name() view returns (string)",
  "function nonces(address owner) view returns (uint256)",
  "function DOMAIN_SEPARATOR() view returns (bytes32)",
  "function permit(address owner, address spender, uint256 value, uint256 deadline, uint8 v, bytes32 r, bytes32 s)"
];

/**
 * Sign an EIP-2612 permit.
 * @param {ethers.Signer} signer - wallet to sign with
 * @param {string} tokenAddress - ERC20 token supporting EIP-2612
 * @param {string} spenderAddress - contract to approve
 * @param {bigint} amount - amount to approve (in token units)
 * @param {number} deadlineSeconds - seconds from now
 * @returns {{ v, r, s, deadline }}
 */
async function signPermit(signer, tokenAddress, spenderAddress, amount, deadlineSeconds = 3600) {
  const token = new ethers.Contract(tokenAddress, ERC20_PERMIT_ABI, signer);
  const owner = await signer.getAddress();
  const nonce = await token.nonces(owner);
  const tokenName = await token.name();
  const deadline = Math.floor(Date.now() / 1000) + deadlineSeconds;
  const chainId = (await signer.provider.getNetwork()).chainId;

  const domain = {
    name: tokenName,
    version: "1",
    chainId,
    verifyingContract: tokenAddress
  };

  const types = {
    Permit: [
      { name: "owner",   type: "address" },
      { name: "spender", type: "address" },
      { name: "value",   type: "uint256" },
      { name: "nonce",   type: "uint256" },
      { name: "deadline",type: "uint256" }
    ]
  };

  const message = { owner, spender: spenderAddress, value: amount, nonce, deadline };

  const signature = await signer.signTypedData(domain, types, message);
  const { v, r, s } = ethers.Signature.from(signature);

  return { v, r, s, deadline, owner, spender: spenderAddress, value: amount };
}

/**
 * Submit a signed permit on-chain.
 */
async function executePermit(signer, tokenAddress, permitData) {
  const token = new ethers.Contract(tokenAddress, ERC20_PERMIT_ABI, signer);
  const { owner, spender, value, deadline, v, r, s } = permitData;
  const tx = await token.permit(owner, spender, value, deadline, v, r, s);
  await tx.wait();
  console.log("Permit executed:", tx.hash);
  return tx;
}

module.exports = { signPermit, executePermit };
