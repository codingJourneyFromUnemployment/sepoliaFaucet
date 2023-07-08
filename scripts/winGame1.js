const hre = require("hardhat");
const { ethers } = require("ethers");
// add the game address here and update the contract name if necessary
const gameAddr = hre.network.config.game1Address[0];
const contractName = "Game1";

async function main() {
    // attach to the game
    // const game = await hre.ethers.getContractAt(contractName, gameAddr);
    const provider = new ethers.JsonRpcProvider(hre.network.config.url);
    const gameArtifact = await hre.artifacts.readArtifact(contractName);
    const gameAbi = gameArtifact.abi
    const gameAddress = gameAddr
    let game = new ethers.Contract(gameAddress, gameAbi, provider);
    const signers = await hre.ethers.getSigners();
    game = game.connect(signers[0]);
   
    let eventHandler = false
    const eventListener = await game.addListener("Winner", (winner) => {
        console.log(`winner is ${winner}`);
        eventHandler = true;
    });

    console.log(eventListener);

    // do whatever you need to do to win the game here:
    const tx = await game.win();

    // did you win? Check the transaction receipt!
    // if you did, it will be in both the logs and events array
    const receipt = await tx.wait();
     
    // console.log(receipt);
    console.log(`winner: ${receipt.from}`);
    while(!eventHandler) {
        console.log(eventHandler)
        await new Promise(r => setTimeout(r, 1000));
    }

}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });