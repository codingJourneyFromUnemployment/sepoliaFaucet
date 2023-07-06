const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('Faucet', function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployContractAndSetVariables() {
    const Faucet = await ethers.getContractFactory('Faucet');
    const faucet = await Faucet.deploy({value:ethers.parseEther('1')});

    const [owner] = await ethers.getSigners();

    console.log('Signer 1 address: ', owner.address);
    return { faucet, owner };
  }

  it('should deploy and set the owner correctly', async function () {
    const { faucet, owner } = await loadFixture(deployContractAndSetVariables);

    expect(await faucet.owner()).to.equal(owner.address);
  });

  it('should with draw less than 0.1 ether for each request', async function () {
    const { faucet, owner } = await loadFixture(deployContractAndSetVariables);
    await faucet.withdraw(ethers.parseEther('0.1'));
    expect(await ethers.provider.getBalance(faucet.address)).to.equal(ethers.parseEther('0.9'));
    await expect(faucet.withdraw(ethers.parseEther('0.2'))).to.be.revertedWith('Failed to send Ether');
  });
});