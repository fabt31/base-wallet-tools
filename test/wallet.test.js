const { expect } = require("chai");
const { ethers } = require("ethers");
const { generateWallet, fromMnemonic, deriveWallets, isValidAddress } = require("../src/wallet");

describe("Wallet Utils", function () {
  describe("generateWallet", function () {
    it("Should generate a valid wallet with address, privateKey, mnemonic", function () {
      const wallet = generateWallet();
      expect(wallet).to.have.property("address");
      expect(wallet).to.have.property("privateKey");
      expect(wallet).to.have.property("mnemonic");
      expect(ethers.utils.isAddress(wallet.address)).to.equal(true);
    });

    it("Should generate unique wallets each time", function () {
      const w1 = generateWallet();
      const w2 = generateWallet();
      expect(w1.address).to.not.equal(w2.address);
    });
  });

  describe("fromMnemonic", function () {
    it("Should derive consistent wallet from mnemonic", function () {
      const mnemonic = "test test test test test test test test test test test junk";
      const w1 = fromMnemonic(mnemonic, 0);
      const w2 = fromMnemonic(mnemonic, 0);
      expect(w1.address).to.equal(w2.address);
    });

    it("Should derive different addresses for different indices", function () {
      const mnemonic = "test test test test test test test test test test test junk";
      const w0 = fromMnemonic(mnemonic, 0);
      const w1 = fromMnemonic(mnemonic, 1);
      expect(w0.address).to.not.equal(w1.address);
    });
  });

  describe("deriveWallets", function () {
    it("Should derive N wallets from a mnemonic", function () {
      const mnemonic = "test test test test test test test test test test test junk";
      const wallets = deriveWallets(mnemonic, 5);
      expect(wallets).to.have.length(5);
      const addresses = wallets.map((w) => w.address);
      expect(new Set(addresses).size).to.equal(5); // all unique
    });
  });

  describe("isValidAddress", function () {
    it("Should return true for a valid checksummed address", function () {
      expect(isValidAddress("0x4200000000000000000000000000000000000006")).to.equal(true);
    });

    it("Should return false for an invalid address", function () {
      expect(isValidAddress("0xnotanaddress")).to.equal(false);
      expect(isValidAddress("hello")).to.equal(false);
    });
  });
});
