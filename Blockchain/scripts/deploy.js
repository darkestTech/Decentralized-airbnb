const hre = require("hardhat");

async function main() {
  console.log("🚀 Deploying DecentralizedAirbnb...");

  // Get the contract factory
  const Airbnb = await hre.ethers.getContractFactory("DecentralizedAirbnb");

  // Deploy the contract (v6 automatically waits for deployment)
  const airbnb = await Airbnb.deploy();

  // ✅ In ethers v6, wait for the transaction instead of .deployed()
  await airbnb.waitForDeployment();

  console.log(`✅ DecentralizedAirbnb deployed at: ${await airbnb.getAddress()}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
