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
    await expect(faucet.connect(owner).withdraw(ethers.parseEther('0.2'))).to.be.revertedWith('you can only withdraw .1 ETH at a time');
  });

  it('only owner can withdraw all', async function () {
    const { faucet } = await loadFixture(deployContractAndSetVariables)
    const signers = await ethers.getSigners();
    const badSigner = signers[1];
    await expect(faucet.connect(badSigner).withdrawAll()).to.be.revertedWith('you are not the owner');
  }
  );

  it('only owner can destroy 1', async function () {
    const { faucet } = await loadFixture(deployContractAndSetVariables);
    const signers = await ethers.getSigners();
    const badSigner = signers[1];
    await expect(faucet.connect(badSigner).destroyFaucet()).to.be.revertedWith('you are not the owner');
  });

  it('only owner can destroy 2', async function () {
    const { faucet, owner } = await loadFixture(deployContractAndSetVariables);
    await faucet.connect(owner).destroyFaucet();
    const contractCode = await ethers.provider.getCode(faucet.getAddress());
    expect(contractCode).to.equal('0x');
  });
});