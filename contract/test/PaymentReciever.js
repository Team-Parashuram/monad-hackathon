import { expect } from "chai";
import hre from "hardhat";
const { ethers } = hre;

describe("PaymentReceiver", function () {
  async function deployPaymentReceiverFixture() {
    const [owner, merchant, payer] = await ethers.getSigners();
    const PaymentReceiver = await ethers.getContractFactory("PaymentReceiver");
    const paymentReceiver = await PaymentReceiver.deploy();

    // Deploy a mock ERC20 token for testing
    const MockERC20 = await ethers.getContractFactory("MockERC20");
    const mockToken = await MockERC20.deploy("Test Token", "TEST", 18, ethers.parseEther("1000"));

    return { paymentReceiver, mockToken, owner, merchant, payer };
  }

  describe("Native token payments", function () {
    it("Should accept native token payment", async function () {
      const { paymentReceiver, merchant, payer } = await deployPaymentReceiverFixture();
      const amount = ethers.parseEther("1");
      
      const merchantBalanceBefore = await ethers.provider.getBalance(merchant.address);
      
      await expect(
        paymentReceiver.connect(payer).pay(merchant.address, ethers.ZeroAddress, amount, { value: amount })
      )
        .to.emit(paymentReceiver, "PaymentReceived")
        .withArgs(merchant.address, payer.address, ethers.ZeroAddress, amount);
      
      const merchantBalanceAfter = await ethers.provider.getBalance(merchant.address);
      expect(merchantBalanceAfter - merchantBalanceBefore).to.equal(amount);
    });

    it("Should reject native token payment with wrong amount", async function () {
      const { paymentReceiver, merchant, payer } = await deployPaymentReceiverFixture();
      const amount = ethers.parseEther("1");
      const wrongAmount = ethers.parseEther("0.5");
      
      await expect(
        paymentReceiver.connect(payer).pay(merchant.address, ethers.ZeroAddress, amount, { value: wrongAmount })
      ).to.be.revertedWith("Incorrect value sent");
    });
  });

  describe("ERC20 token payments", function () {
    it("Should accept ERC20 token payment", async function () {
      const { paymentReceiver, mockToken, merchant, payer } = await deployPaymentReceiverFixture();
      const amount = ethers.parseEther("100");
      
      // Transfer tokens to payer and approve
      await mockToken.transfer(payer.address, amount);
      await mockToken.connect(payer).approve(paymentReceiver.getAddress(), amount);
      
      const merchantBalanceBefore = await mockToken.balanceOf(merchant.address);
      
      await expect(
        paymentReceiver.connect(payer).pay(merchant.address, await mockToken.getAddress(), amount)
      )
        .to.emit(paymentReceiver, "PaymentReceived")
        .withArgs(merchant.address, payer.address, await mockToken.getAddress(), amount);
      
      const merchantBalanceAfter = await mockToken.balanceOf(merchant.address);
      expect(merchantBalanceAfter - merchantBalanceBefore).to.equal(amount);
    });

    it("Should reject ERC20 payment without approval", async function () {
      const { paymentReceiver, mockToken, merchant, payer } = await deployPaymentReceiverFixture();
      const amount = ethers.parseEther("100");
      
      await mockToken.transfer(payer.address, amount);
      // Don't approve
      
      await expect(
        paymentReceiver.connect(payer).pay(merchant.address, await mockToken.getAddress(), amount)
      ).to.be.revertedWith("ERC20: insufficient allowance");
    });
  });
});
