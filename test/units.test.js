const { expect } = require("chai");
const { ethers } = require("ethers");
const { toWei, fromWei, toTokenUnits, fromTokenUnits, formatGwei, hexToNumber } = require("../utils/units");

describe("Units Utils", function () {
  describe("toWei / fromWei", function () {
    it("Should convert 1 ETH to 1e18 wei", function () {
      const wei = toWei(1);
      expect(wei.toString()).to.equal(ethers.utils.parseEther("1").toString());
    });

    it("Should round-trip ETH -> wei -> ETH", function () {
      const original = "1.5";
      const wei = toWei(original);
      expect(fromWei(wei)).to.equal(original);
    });
  });

  describe("toTokenUnits / fromTokenUnits", function () {
    it("Should convert USDC with 6 decimals", function () {
      const raw = toTokenUnits(100, 6);
      expect(raw.toString()).to.equal("100000000");
    });

    it("Should format back from raw units", function () {
      const formatted = fromTokenUnits("100000000", 6);
      expect(formatted).to.equal("100.0");
    });
  });

  describe("hexToNumber", function () {
    it("Should convert hex to decimal", function () {
      expect(hexToNumber("0xff")).to.equal(255);
      expect(hexToNumber("0x2a")).to.equal(42);
    });
  });

  describe("formatGwei", function () {
    it("Should format wei as gwei string", function () {
      const result = formatGwei(1000000000);
      expect(result).to.include("gwei");
    });
  });
});
