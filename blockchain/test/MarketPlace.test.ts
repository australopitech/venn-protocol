import { ethers } from "hardhat";
import { expect } from "chai";
import { mine } from "@nomicfoundation/hardhat-network-helpers";
import { RWalletFactory, NFT, ReceiptNFT, MarketPlace, RWallet } from "../typechain";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { BigNumber, Contract } from "ethers";
import { 
    deployFactory, nftDeployAndMint, deployMktPlace, createWallet,
    deployReceiptsContract, listNFT, rentNFT, mint
} from "./rWallet-testutils";

describe.skip("Testing MarketPlace", function () {
    let factory: RWalletFactory;
    let nft: NFT;
    let receiptContract: ReceiptNFT;
    let mktPlace: MarketPlace;
    let wallet: RWallet;
    let owner: SignerWithAddress;
    let signer_1: SignerWithAddress;
    let signer_2: SignerWithAddress;
    let entryPoint: SignerWithAddress;
    let tokenId: BigNumber;
    const servFee = 30;
    const pullFee = 2500;
    const provider = ethers.provider;
    
    before(async () => {
        [owner, entryPoint, signer_1, signer_2] = await ethers.getSigners();
        console.log('flag')

        factory = await deployFactory(signer_1, entryPoint.address);
        [nft, tokenId] = await nftDeployAndMint(signer_1, signer_2.address);
        receiptContract = await deployReceiptsContract(signer_1);
        console.log('flag')
        
        mktPlace = await deployMktPlace(
            signer_1, factory.address, receiptContract.address, servFee, pullFee
        );
        const role = ethers.utils.id("MINTER_ROLE");
        const grantRole = await receiptContract.connect(signer_1).grantRole(role, mktPlace.address);
        await grantRole.wait();
        console.log('flag')
        
        expect(await receiptContract.hasRole(role, mktPlace.address)).to.eq(true);
        console.log('flag')
        
        wallet = await createWallet(factory, owner.address);
        console.log('flag')
        
        const nft1owner = await nft.ownerOf(tokenId);
        expect(nft1owner).to.eq(signer_2.address);
    });

    it("should emit a receipt-token to the caller upon listing nft and update listing metadata", async () => {
        const price = 10;
        const maxDuration = 10000;
        await listNFT(signer_2, mktPlace, nft, tokenId, price, maxDuration);
        expect(await nft.ownerOf(tokenId)).to.eq(mktPlace.address);
        expect(await mktPlace.getPrice(nft.address, tokenId)).to.eq(price);
        expect(await mktPlace.getMaxDuration(nft.address, tokenId)).to.eq(maxDuration);
        
        const receipt = await mktPlace.getReceipt(nft.address, tokenId);
        // console.log('\nreceipt', receipt);
        expect(await receiptContract.ownerOf(receipt)).to.eq(signer_2.address);

        const uri = await nft.tokenURI(tokenId);
        expect(await receiptContract.tokenURI(receipt)).to.eq(uri);
    });

    it("should allow receipt-owners to change listing metadata", async () => {
        const receipt = await mktPlace.getReceipt(nft.address, tokenId);
        expect(await receiptContract.ownerOf(receipt)).to.eq(signer_2.address);
        const maxDuration = 1999999;
        const price = 1999;
        await expect(mktPlace.connect(signer_1).setMaxDuration(nft.address, tokenId, maxDuration))
         .to.be.revertedWith("error: token not listed or caller not owner of receipt-token");
        await expect(mktPlace.connect(signer_1).setPrice(nft.address, tokenId, price))
         .to.be.revertedWith("error: token not listed or caller not owner of receipt-token");
        
        await mktPlace.connect(signer_2).setMaxDuration(nft.address, tokenId, maxDuration);
        await mktPlace.connect(signer_2).setPrice(nft.address, tokenId, price);

        expect(await mktPlace.getMaxDuration(nft.address, tokenId)).to.eq(maxDuration);
        expect(await mktPlace.getPrice(nft.address, tokenId)).to.eq(price);

    });

    it("should allow de-listing, burn receipt and transfer asset back to receipt holder", async () => {
        const receipt = await mktPlace.getReceipt(nft.address, tokenId);
        await receiptContract.connect(signer_2)
         .transferFrom(signer_2.address, signer_1.address, receipt);
        
        expect(await receiptContract.ownerOf(receipt)).to.eq(signer_1.address);
        
        await expect(mktPlace.connect(signer_2).deList(nft.address, tokenId))
         .to.be.revertedWith("only owner of receipt");
        
        await mktPlace.connect(signer_1).deList(nft.address, tokenId);
        
        await expect(receiptContract.ownerOf(receipt)).to.be.revertedWith("ERC721: invalid token ID");
        expect(await mktPlace.getMaxDuration(nft.address, tokenId)).to.eq(0);
        expect(await nft.ownerOf(tokenId)).to.eq(signer_1.address);
    });

    it("should allow rwallet accounts to rent listed nfts / block ordinary accounts", async () => {
        const price = 10;
        const maxDuration = 10000;
        // console.log(tokenId.toNumber())
        // return
        await listNFT(signer_1, mktPlace, nft, tokenId, price, maxDuration);
        await expect(mktPlace.connect(signer_2).rentNFT(nft.address, tokenId, maxDuration/100))
         .to.be.revertedWith("caller is not a renter wallet contract");

        const duration = 100;
        await rentNFT(
            wallet, owner, mktPlace, nft.address, tokenId, duration, 10
        );
        expect(await nft.ownerOf(tokenId)).to.eq(wallet.address);
        expect(await mktPlace.getBalance(signer_1.address)).to.eq(price*duration);

    });
    it("should allow de-listing nft while it is rented out", async () => {
        expect(await nft.ownerOf(tokenId)).to.eq(wallet.address);
        
        let blocktime = (await provider.getBlock('latest')).timestamp;
        const loans = await wallet.getRentals();
        const endTime = loans[0].endTime.toNumber();
        console.log(`\n==>blocktime: ${blocktime}\n==>endTime: ${endTime}\n==>remaining: ${endTime-blocktime}`);

        const deListTx = await mktPlace.connect(signer_1).deList(nft.address, tokenId);
        await deListTx.wait();
        expect(await mktPlace.getMaxDuration(nft.address, tokenId)).to.eq(0);
        expect(await mktPlace.getPrice(nft.address, tokenId)).to.eq(0);
        const __owner = await nft.ownerOf(tokenId);
        // console.log("current owner wallet?", __owner == wallet.address)
    });

    it("should pull nft back to owner after endTime (if de-listed), pay pullFee ", async () => {
        let blocktime = (await provider.getBlock('latest')).timestamp;
        const loans = await wallet.getRentals();
        const endTime = loans[0].endTime.toNumber();
        console.log(`\n\n==>blocktime: ${blocktime}\n==>endTime: ${endTime}\n==>remaining: ${endTime-blocktime}`);
        await mine(12, {interval: 10});
        blocktime = (await provider.getBlock('latest')).timestamp;
        console.log(`\n\n==>blocktime after mining: ${blocktime}\n==>remaining: ${endTime-blocktime}`);

        const callerBalance = await provider.getBalance(signer_2.address);
        const receiptid = await mktPlace.getReceipt(nft.address, tokenId);
        const receiptOwner = await receiptContract.ownerOf(receiptid)

        const pullFee = await mktPlace.getPullFee(receiptid)
        const pullTx = await mktPlace.connect(signer_2).pullAsset(nft.address, tokenId)
        const receipt = await pullTx.wait();
        // console.log(receipt)
        const txFee = receipt.gasUsed.mul(receipt.effectiveGasPrice)
        // since nft was de-listed it goes straight to owner of receipt
        expect(await nft.ownerOf(tokenId)).to.eq(receiptOwner);

        // expect fee to be properly paid to caller
        const callerBalanceAfter = await provider.getBalance(signer_2.address);
        expect(callerBalanceAfter).to.eq(callerBalance.add(pullFee).sub(txFee));

        // exepect receipt to be burned and mapping zero'ed
        await expect(receiptContract.ownerOf(receiptid)).to.be.revertedWith("ERC721: invalid token ID");
        expect(await mktPlace.getReceipt(nft.address, tokenId)).to.eq(0);
    });

    it("nft should be pulled to mktplace when still listed ", async () => {
        expect(await nft.ownerOf(tokenId)).to.eq(signer_1.address);
        const price = 10000;
        const maxDuration = 10;
        const listTx = await listNFT(signer_1, mktPlace, nft, tokenId, price, maxDuration);
        await listTx.wait();

        const rentTx = await rentNFT(wallet, owner, mktPlace, nft.address, tokenId, 1, price);
        expect(await nft.ownerOf(tokenId)).to.eq(wallet.address);

        await mine(2, {interval: 10});
        let blocktime = (await provider.getBlock('latest')).timestamp;
        const loans = await wallet.getRentals();
        // console.log(`\nrent expired? ${blocktime > loans[0].endTime.toNumber()}`);

        const callerBalance = await provider.getBalance(signer_2.address);
        const receiptId = await mktPlace.getReceipt(nft.address, tokenId);
        const pullFee = await mktPlace.getPullFee(receiptId);
        const pullTx = await mktPlace.connect(signer_2).pullAsset(nft.address, tokenId);
        const txReceipt = await pullTx.wait();
        const txfee = txReceipt.gasUsed.mul(txReceipt.effectiveGasPrice);
        
        expect(await nft.ownerOf(tokenId)).to.eq(mktPlace.address);
        
        // listing metadata should be the same
        expect(await mktPlace.getMaxDuration(nft.address, tokenId)).to.eq(maxDuration);
        expect(await mktPlace.getPrice(nft.address, tokenId)).to.eq(price);

        // fee should be paid
        const callerBalanceAfter = await provider.getBalance(signer_2.address);
        expect(callerBalanceAfter).to.eq(callerBalance.add(pullFee).sub(txfee));

    });

    it("should release nft back to owner upon de-listing, when not rented out", async () => {
        expect(await nft.ownerOf(tokenId)).to.eq(mktPlace.address);
        const receiptId = await mktPlace.getReceipt(nft.address, tokenId);
        expect(await receiptContract.ownerOf(receiptId)).to.eq(signer_1.address);
        
        const deListTx = await mktPlace.connect(signer_1).deList(nft.address, tokenId);
        deListTx.wait();

        expect(await nft.ownerOf(tokenId)).to.eq(signer_1.address);

        // should remove listing metadata
        expect(await mktPlace.getMaxDuration(nft.address, tokenId)).to.eq(0);
        expect(await mktPlace.getPrice(nft.address, tokenId)).to.eq(0);
        // should remove receipt entry
        expect(await mktPlace.getReceipt(nft.address, tokenId)).to.eq(0);
        // should burn receipt
        await expect(receiptContract.ownerOf(receiptId)).to.be.revertedWith("ERC721: invalid token ID");
    });

    it("should release nft back to owner upon de-listeng when rented but rent is due", async () => {
        expect(await nft.ownerOf(tokenId)).to.eq(signer_1.address);
        const price = 10**4;
        const maxDuration = 10**5
        await listNFT(signer_1, mktPlace, nft, tokenId, price, maxDuration);
        await rentNFT(wallet, owner, mktPlace, nft.address, tokenId, 1, price);
        await mine(2, {interval: 10});
        const blocktime = (await provider.getBlock('latest')).timestamp;
        const loans = await wallet.getRentals();
        console.log(`rent due? ${blocktime > loans[0].endTime.toNumber()}`);
        const bal = await provider.getBalance(signer_1.address);
        const receiptToken = await mktPlace.getReceipt(nft.address, tokenId);
        const pullfee = await mktPlace.getPullFee(receiptToken);
        // 
        const delist = await mktPlace.connect(signer_1).deList(nft.address, tokenId);
        const txReceipt = await delist.wait();
        expect(await nft.ownerOf(tokenId)).to.eq(signer_1.address);
        // pull fee should go to user
        const txfee = txReceipt.gasUsed.mul(txReceipt.effectiveGasPrice);
        const bal_after = await provider.getBalance(signer_1.address);
        expect(bal_after).to.eq(bal.add(pullfee).sub(txfee));
    });

    it("should allow users to withdraw positive balances", async () => {
        const user_bal = await mktPlace.getBalance(signer_1.address)
        // console.log('balance', bal.toString());
        const account_bal = await provider.getBalance(signer_1.address);
        const withdraw = await mktPlace.connect(signer_1).withdraw();
        const txReceipt = await withdraw.wait();
        const txfee = txReceipt.gasUsed.mul(txReceipt.effectiveGasPrice);
        const account_bal_after = await provider.getBalance(signer_1.address);
        expect(account_bal_after).to.eq(account_bal.add(user_bal).sub(txfee));
    });

    it("should allow listing and renting with price == zero", async() => {
        const newToken = await mint(nft, signer_1, signer_2.address );
        await listNFT(signer_2, mktPlace, nft, newToken, 0, 10);
        expect(await mktPlace.getMaxDuration(nft.address, newToken)).to.eq(10);
        expect(await mktPlace.getPrice(nft.address, newToken)).to.eq(0);
        expect(await nft.ownerOf(newToken)).to.eq(mktPlace.address);
        const receiptId = await mktPlace.getReceipt(nft.address, newToken);
        expect(await receiptContract.ownerOf(receiptId)).to.eq(signer_2.address);

        await rentNFT(wallet, owner, mktPlace, nft.address, newToken, 2, 0);
        expect(await nft.ownerOf(newToken)).to.eq(wallet.address);
        const rentals = await wallet.getRentals();
        console.log('rentals', rentals);

    });

    it("underflow test", async () => {
        const newToken = await mint(nft, signer_1, signer_2.address);
        // if price and duration are low enough the fees calculations underflows
        const price = 1;
        await listNFT(signer_2, mktPlace, nft, newToken, price, 10 );
        const duration = 1;
        // await rentNFT(wallet, owner, mktPlace, nft.address, newToken, duration, price);
        let abi= [
            "function rentNFT (address contract_, uint256 tokenId, uint256 duration)"
        ];
        let iface = new ethers.utils.Interface(abi);
        const calldata_ = iface.encodeFunctionData("rentNFT", [
            nft.address,
            newToken,
            duration
        ]);
        // console.log(calldata_);
    
        const value = BigNumber.from(price*duration ).add(ethers.utils.parseEther('1'));
        await owner.sendTransaction({to: wallet.address, value: value })
        
        await wallet.connect(owner).execute(mktPlace.address, value, calldata_);
        
        // pullFee = (((price*duration*feeMul)/feeBase)*pullFeeMul)/pullFeeBase
        //         = ((1*1*3)/1000)*1/3 = 3/3000 = 1/1000
        const pullFee = await mktPlace.getPullFee(await mktPlace.getReceipt(nft.address, newToken))
        console.log('pullFee', pullFee);
    });

});