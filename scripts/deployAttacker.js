const ethers = require('ethers');
require('dotenv').config();
const hre = require("hardhat");

async function main() {
    console.log('deploying...');
    const provider = new ethers.JsonRpcProvider(hre.network.config.url);
    const signers = await hre.ethers.getSigners();
    const deployer = signers[0];
    const emitWinnerArtifact = await hre.artifacts.readArtifact("EmitWinner"); 
    const emitWinnerAbi = emitWinnerArtifact.abi;
    const emitWinnerAddress = hre.network.config.constructorArgs[0];
    const emitWinnerContract = new ethers.Contract(emitWinnerAddress, emitWinnerAbi, provider);
    let eventHandled = false;

    if(hre.network.name === "localhost"){
        console.log('network: localhost');
    } else {
        console.log(`network: ${hre.network.name}`)
    }
    const attackerContract = await hre.ethers.getContractFactory("Attacker", deployer);
    const deployedAttackerContract = await attackerContract.deploy(hre.network.config.constructorArgs[0]);
    const address = await deployedAttackerContract.getAddress();
    console.log("Attacker address:", address);
    const eventListener = await emitWinnerContract.addListener("Winner", (msg) => {
        console.log(`Winner: ${msg} attacked successfully!`);
        eventHandled = true;
    });
    const tx = await deployedAttackerContract.attack();
    console.log("Attacker tx:", tx.hash);
    while(!eventHandled){
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });