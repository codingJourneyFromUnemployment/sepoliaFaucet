const ethers = require('ethers');
require('dotenv').config();
const hre = require("hardhat");

async function main() {
    console.log('deploying...');
    const signers = await hre.ethers.getSigners();
    const deployer = signers[0];

    if(hre.network.name === "localhost"){
        console.log('network: localhost');
    } else {
        console.log(`network: ${hre.network.name}`)
    }
    const emitWinnerContract = await hre.ethers.getContractFactory("EmitWinner", deployer);
    const deployedEmitWinnerContract = await emitWinnerContract.deploy();
    const address = await deployedEmitWinnerContract.getAddress();
    console.log("EmitWinner address:", address);
    
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });