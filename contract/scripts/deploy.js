import hre from "hardhat";
import fs from "fs";

async function main() {
  console.log("Deploying PaymentReceiver contract...");
  
  const PaymentReceiver = await hre.ethers.getContractFactory("PaymentReceiver");
  const paymentReceiver = await PaymentReceiver.deploy();
  
  await paymentReceiver.waitForDeployment();
  
  const address = await paymentReceiver.getAddress();
  console.log("PaymentReceiver deployed to:", address);
  
  // Save deployment info
  const deploymentInfo = {
    PaymentReceiver: address,
    network: "localhost",
    chainId: 1337
  };
  
  fs.writeFileSync(
    './deployed-contract.json', 
    JSON.stringify(deploymentInfo, null, 2)
  );
  
  console.log("Deployment info saved to deployed-contract.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
