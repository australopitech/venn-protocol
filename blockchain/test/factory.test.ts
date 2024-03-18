import { ethers } from "hardhat";
import { expect } from "chai";
import { SmartAccountFactory, SmartAccountFactory__factory, EntryPoint__factory } from "../typechain";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { abi } from "../artifacts/contracts/protocol/SmartAccount.sol/SmartAccount.json";
import { deployEntryPoint } from "./testutils";

describe.skip("Testing accountFactory", function () {
    let factoryFactory: SmartAccountFactory__factory;
    let factoryContract: SmartAccountFactory;
    let owner: SignerWithAddress;
    let accountAddress: any;
    const entryPoint = ethers.utils.getAddress(ethers.utils.ripemd160("0x"));
    const provider = ethers.provider;
    
    before(async () => {
        [owner] = await ethers.getSigners();
        console.log('\nDeploying factory contract...');
        factoryFactory = new SmartAccountFactory__factory(owner);
        factoryContract = await factoryFactory.deploy(entryPoint);
        // const receipt = await factoryContract.deployTransaction.wait();
        console.log(`\naccountFactory deployed to address ${factoryContract.address}\n`);
    });
    it("should create a account contract", async () => {
        const salt = 2;
        const newAccountTx = await factoryContract.createAccount(owner.address, salt);
        const newAccountReceipt = await newAccountTx.wait();
        // let newAccountEvent: Event | undefined;
        const newAccountEvent = newAccountReceipt.events?.find(
            (event: any) => event.event === 'accountCreated'
        );
        accountAddress = newAccountEvent?.args?.account;
        const account = new ethers.Contract(accountAddress, abi, provider);
        const ownerFromGetter = await account.owner();
        expect(ownerFromGetter).to.eq(owner.address);
        const entryPointFromGetter = await account.entryPoint();
        expect(entryPointFromGetter).to.eq(entryPoint);
    });
    it("should store account address", async () => {
        // console.log('accountAddress', accountAddress);
        const isaccount_ = await factoryContract.isSmartAccount(accountAddress);
        expect(isaccount_).to.eq(true);
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

