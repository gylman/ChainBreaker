import { ethers } from "hardhat";

async function main() {
  const lock = await ethers.deployContract("ChainBreak", {
    // gasPrice: ethers.parseUnits("2", "gwei"),
    gasLimit: 1000000,
  });

  await lock.waitForDeployment();

  console.log(`ChainBreak deployed to ${await lock.getAddress()}.`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
