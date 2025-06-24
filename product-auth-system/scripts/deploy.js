const hre = require("hardhat");

async function main() {
  const ProductAuth = await hre.ethers.getContractFactory("ProductAuth");
  const productAuth = await ProductAuth.deploy();
  await productAuth.deployed();
  console.log("ProductAuth deployed to:", productAuth.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });