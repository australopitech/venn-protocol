import { ethers } from "hardhat";
import { expect } from "chai";
import { RWalletFactory, RWalletFactory__factory, EntryPoint__factory } from "../typechain";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { abi } from "../artifacts/contracts/wallet/RWallet.sol/RWallet.json";
import { deployEntryPoint } from "./testutils";

describe.skip("Testing WalletFactory", function () {
    let factoryFactory: RWalletFactory__factory;
    let factoryContract: RWalletFactory;
    let owner: SignerWithAddress;
    let walletAddress: any;
    const entryPoint = ethers.utils.getAddress(ethers.utils.ripemd160("0x"));
    const provider = ethers.provider;
    
    before(async () => {
        [owner] = await ethers.getSigners();
        console.log('\nDeploying factory contract...');
        factoryFactory = new RWalletFactory__factory(owner);
        factoryContract = await factoryFactory.deploy(entryPoint);
        // const receipt = await factoryContract.deployTransaction.wait();
        console.log(`\nWalletFactory deployed to address ${factoryContract.address}\n`);
    });
    it("should create a wallet contract", async () => {
        const salt = 2;
        const newAccountTx = await factoryContract.createAccount(owner.address, salt);
        const newAccountReceipt = await newAccountTx.wait();
        // let newAccountEvent: Event | undefined;
        const newAccountEvent = newAccountReceipt.events?.find(
            (event: any) => event.event === 'WalletCreated'
        );
        walletAddress = newAccountEvent?.args?.account;
        const wallet = new ethers.Contract(walletAddress, abi, provider);
        const ownerFromGetter = await wallet.owner();
        expect(ownerFromGetter).to.eq(owner.address);
        const entryPointFromGetter = await wallet.entryPoint();
        expect(entryPointFromGetter).to.eq(entryPoint);
    });
    it("should store wallet address", async () => {
        // console.log('walletAddress', walletAddress);
        const isWallet_ = await factoryContract.isWallet(walletAddress);
        expect(isWallet_).to.eq(true);
    });
    it("should stake at entryPoint contract", async () => {
        const entryPoint = await deployEntryPoint();
        const usntakeDelay = 10000;
        const stake = await factoryContract.stake(
            entryPoint.address,
            usntakeDelay,
            {value: ethers.utils.parseEther('1')} 
        );
        await stake.wait();
        const depositInfo = await entryPoint.getDepositInfo(factoryContract.address);
        console.log(depositInfo);
        
    })
});

