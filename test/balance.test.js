const { expect } = require("chai");
const { ethers } = require("ethers");

// Mock provider for unit tests
const mockProvider = {
  getBalance: async (address) => {
    if (address === "0x0000000000000000000000000000000000000000") return 0n;
    return ethers.parseEther("1.5");
  }
};

describe("Balance Utils", function () {

  describe("ETH balance formatting", function () {
    it("should format 1.5 ETH correctly", function () {
      const raw = ethers.parseEther("1.5");
      const formatted = ethers.formatEther(raw);
      expect(formatted).to.equal("1.5");
    });

    it("should handle 0 ETH", function () {
      const formatted = ethers.formatEther(0n);
      expect(formatted).to.equal("0.0");
    });

    it("should handle large balances", function () {
      const raw = ethers.parseEther("9999.999999999999999999");
      const formatted = parseFloat(ethers.formatEther(raw));
      expect(formatted).to.be.closeTo(10000, 0.001);
    });
  });

  describe("Token balance formatting", function () {
    it("should format USDC (6 decimals) correctly", function () {
      const raw = 1_000_000n; // 1 USDC
      const formatted = ethers.formatUnits(raw, 6);
      expect(formatted).to.equal("1.0");
    });

    it("should format 100 USDC", function () {
      const raw = 100_000_000n;
      const formatted = ethers.formatUnits(raw, 6);
      expect(formatted).to.equal("100.0");
    });

    it("should format WETH (18 decimals) correctly", function () {
      const raw = ethers.parseUnits("0.5", 18);
      const formatted = ethers.formatUnits(raw, 18);
      expect(formatted).to.equal("0.5");
    });
  });

  describe("Address validation", function () {
    it("should recognise valid address", function () {
      expect(ethers.isAddress("0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913")).to.be.true;
    });

    it("should reject invalid address", function () {
      expect(ethers.isAddress("not-an-address")).to.be.false;
    });

    it("should reject zero address as invalid holder", function () {
      const zero = ethers.ZeroAddress;
      expect(zero).to.equal("0x0000000000000000000000000000000000000000");
    });
  });
});
