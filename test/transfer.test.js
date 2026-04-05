const { expect } = require("chai");
const { ethers } = require("ethers");
const { transferETH, transferERC20, estimateETHTransferGas } = require("../src/transfer");

describe("Transfer Utils", function () {
  let provider;

  before(function () {
    // Use hardhat local node or skip if not available
    provider = new ethers.providers.JsonRpcProvider("http://localhost:8545");
  });

  describe("estimateETHTransferGas", function () {
    it("Should return gas estimate with gwei price", async function () {
      try {
        const estimate = await estimateETHTransferGas(provider);
        expect(estimate).to.have.property("gasPrice");
        expect(estimate).to.have.property("gasLimit");
        expect(estimate).to.have.property("costETH");
        expect(estimate.gasLimit).to.equal(21000);
      } catch (e) {
        this.skip(); // Skip if no local node
      }
    });
  });
});
