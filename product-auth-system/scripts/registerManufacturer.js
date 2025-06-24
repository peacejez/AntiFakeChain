const hre = require("hardhat");

async function main() {
  // Get signers
  const [owner] = await hre.ethers.getSigners();
  console.log("Using account:", owner.address);

  // Attach to contract
  const Contract = await hre.ethers.getContractFactory("ProductAuth");
  const contract = await Contract.attach("0x5FbDB2315678afecb367f032d93F642f64180aa3");
  
  // Verify contract connection
  console.log("Contract owner:", await contract.manufacturer());
  
  // Register manufacturer
  console.log("Registering manufacturer...");
  const tx = await contract.registerManufacturer("0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266");
  const receipt = await tx.wait();
  console.log("Transaction hash:", tx.hash);
  
  // Verify registration (with correct spelling)
  const isManufacturer = await contract.registeredManufacturers("0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266");
  console.log("Is manufacturer?", isManufacturer);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Full error:", error);
    process.exit(1);
  });