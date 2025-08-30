import hre from "hardhat";

async function main() {
  console.log("Deploying PaymentReceiver contract...");
  
  // Get the first signer (deployer)
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);
  
  // Deploy PaymentReceiver
  const PaymentReceiver = await hre.ethers.getContractFactory("PaymentReceiver");
  const paymentReceiver = await PaymentReceiver.deploy();
  await paymentReceiver.waitForDeployment();
  
  const address = await paymentReceiver.getAddress();
  console.log("PaymentReceiver deployed to:", address);
  
  // Also deploy a test ERC20 token for testing
  console.log("Deploying MockERC20 token...");
  const MockERC20 = await hre.ethers.getContractFactory("MockERC20");
  const testToken = await MockERC20.deploy(
    "Test USDC",
    "TUSDC", 
    6,
    hre.ethers.parseUnits("1000000", 6) // 1M tokens
  );
  await testToken.waitForDeployment();
  
  const tokenAddress = await testToken.getAddress();
  console.log("Test USDC deployed to:", tokenAddress);
  
  console.log("\n=== Deployment Summary ===");
  console.log("PaymentReceiver:", address);
  console.log("Test USDC:", tokenAddress);
  console.log("Network: localhost");
  console.log("Chain ID: 1337");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
