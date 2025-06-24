const hre = require("hardhat");

async function main() {
  const contract = await hre.ethers.getContractAt(
    "ProductAuth",
    "0x5FbDB2315678afecb367f032d93F642f64180aa3"
  );
  
  console.log("Testing contract connection...");
  try {
    const owner = await contract.manufacturer();
    console.log("Contract owner:", owner);
    console.log("Is 0xf39f...92266 manufacturer?", 
      await contract.registeredManufacturers("0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266"));
  } catch (error) {
    console.error("Verification failed. Possible issues:");
    console.log("- Contract address incorrect");
    console.log("- ABI mismatch");
    console.log("- Contract not deployed");
    console.error("Full error:", error);
  }
}

main().catch(console.error);