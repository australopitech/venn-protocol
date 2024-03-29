import { ethers } from "hardhat";
import { expect } from "chai";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { 
    SmartAccountFactory__factory, SmartAccountFactory, SmartAccount, NFT__factory, NFT, MarketPlace, ReceiptNFT
} from "../typechain";
import { BigNumber, Contract } from "ethers";
import { mine } from "@nomicfoundation/hardhat-network-helpers";
import { deployFactory, createAccount, rentNFT, deployReceiptsContract, deployMktPlace, nftDeployAndMint } from "./test-utils";

describe.skip("Testing account", function () {
    
        const provider = ethers.provider;
        let owner: SignerWithAddress;
        let signer_1: SignerWithAddress;
        let signer_2: SignerWithAddress;
        let accountFactory: SmartAccountFactory;
        let account: SmartAccount;
        let nftFactory: NFT__factory;
        let nft: NFT;
        let tokenId: BigNumber;
        let newToken: BigNumber;
        let newerToken: BigNumber;
        let oneMoreToken: BigNumber;
        let uri = "uri";
        let receiptsContract: ReceiptNFT;
        let mktPlace: MarketPlace;
        const entryPoint = ethers.utils.getAddress(ethers.utils.ripemd160("0x"));
        const servAliq = 40;
        const pullAliq = 2500;

    const mint = async (contract: NFT, owner: SignerWithAddress, to: string) : Promise<BigNumber> => {
        const mintTx = await nft.connect(owner).safeMint(to, uri);
        const mintReceipt = await mintTx.wait();
        const mintEvent = mintReceipt.events?.find(
                (event: any) => event.event === 'Transfer'
            );
        const token = mintEvent?.args?.tokenId;
        const nft1owner = await nft.ownerOf(token);
        expect(nft1owner).to.eq(to);
        console.log(`\nnft ${token} minted to ${to}\n`);
        return token;
    }
        
    before(async () => {
        [owner, signer_1, signer_2] = await ethers.getSigners();

        accountFactory = await deployFactory(signer_2, entryPoint);
        
        account = await createAccount(accountFactory, owner.address);
        // console.log(`\naccount deployed at ${account.address}\n`);
        
        [nft, tokenId] = await nftDeployAndMint(signer_2, signer_1.address);

        receiptsContract = await deployReceiptsContract(signer_2);
        mktPlace = await  deployMktPlace(
            signer_2, accountFactory.address, receiptsContract.address, servAliq, pullAliq);
        const role = ethers.utils.id("MINTER_ROLE");
        const grantRole = await receiptsContract.connect(signer_2).grantRole(role, mktPlace.address);
        await grantRole.wait();
        
    });

    it("should be owned by owner", async () => {
        const ownerFromGetter = await account.owner();
        expect(ownerFromGetter).to.eq(owner.address);
    });

    it("should make simple transfers", async () => {
        await owner.sendTransaction({to: account.address, value: ethers.utils.parseEther('1')});
        const signer_2Bal_0 = await provider.getBalance(signer_2.address);
        const transferValue = ethers.utils.parseEther('0.5');
        const tx = await account.connect(owner).execute(signer_2.address, transferValue, "0x");
        await tx.wait();
        // const signer_2Bal_1 = await provider.getBalance(signer_2.address);
        expect(await provider.getBalance(signer_2.address))
         .to.eq(signer_2Bal_0.add(transferValue));
    });

    it("should make external calls", async () => {
        const approveTx = await nft.connect(signer_1).approve(account.address, tokenId);
        await approveTx.wait();
        const approved = await nft.getApproved(tokenId);
        expect(approved).to.eq(account.address);
        const abi = [
            "function safeTransferFrom(address from,address to,uint256 tokenId)"
        ]
        const iface = new ethers.utils.Interface(abi);
        const calldata_ = iface.encodeFunctionData("safeTransferFrom", [
            signer_1.address,
            account.address,
            tokenId            
        ])
        const tx = await account.connect(owner).execute(nft.address, 0, calldata_ );
        await tx.wait();
        const newOwner = await nft.ownerOf(tokenId);
        expect(newOwner).to.eq(account.address);
    });
    
    it("should restrict execute calls to onlyOwner", async () => {
        const abi_ = [
            "function transferFrom(address from, address to, uint256 tokenId)"
        ];
        const iface_ = new ethers.utils.Interface(abi_);
        const calldata__ = iface_.encodeFunctionData("transferFrom", [
            signer_1.address,
            signer_2.address,
            tokenId    
        ]);
        await expect(account.connect(signer_2).execute(nft.address, 0, calldata__))
         .to.be.revertedWith("account: not Owner or EntryPoint");
    });

    it("should be able to rent NFT's in MarketPlace", async () => {
        newToken = await mint(nft, signer_2, signer_1.address);
        newerToken = await mint(nft, signer_2, signer_1.address);

        const price = ethers.utils.parseEther('0.00001');
        const maxDuration = 1000;
        // 1st listing
        let approve = await nft.connect(signer_1).approve(mktPlace.address, newToken);
        await approve.wait();

        let listTx = await mktPlace.connect(signer_1).listNFT(nft.address, newToken, price, maxDuration );
        await listTx.wait();
        
        // 2nd listing
        approve = await nft.connect(signer_1).approve(mktPlace.address, newerToken);
        await approve.wait();

        listTx = await mktPlace.connect(signer_1).listNFT(nft.address, newerToken, price, maxDuration );
        await listTx.wait();
        
        // const fee = price.mul(maxDuration/10).mul(servAliq).div(10000);
        // const value = price.mul(maxDuration/10).add(fee);
        // console.log(value.toString());

        // const one_eth = ethers.utils.parseEther('1');
        // const fund = await owner.sendTransaction({to: account.address, value: value.add(one_eth)});
        // await fund.wait();

        // 1st rental
        let rentTx = await rentNFT(
            account,
            owner,
            mktPlace,
            nft.address,
            newToken,
            maxDuration/10,
            price.toNumber()
        );

        // console.log('blockNo', rentTx.blockNumber);
        let block = await provider.getBlock(rentTx.blockNumber);
        // console.log('timestamp', block.timestamp);

        let newOwner = await nft.ownerOf(newToken);
        expect(newOwner).to.eq(account.address);

        let tkIndex = await account.getTokenIndex(nft.address, newToken);
        expect(tkIndex).to.eq(0);
        let rentals = await account.getRentals();
        expect(rentals[tkIndex.toNumber()].endTime).to.eq(block.timestamp + maxDuration/10);
        
        // 2nd rental
        rentTx = await rentNFT(
            account,
            owner,
            mktPlace,
            nft.address,
            newerToken,
            maxDuration/5,
            price.toNumber()
        );

        // console.log('blockNo', rentTx.blockNumber);
        block = await provider.getBlock(rentTx.blockNumber);
        // console.log('timestamp', block.timestamp);

        newOwner = await nft.ownerOf(newerToken);
        expect(newOwner).to.eq(account.address);

        tkIndex = await account.getTokenIndex(nft.address, newerToken);
        expect(tkIndex).to.eq(1);
        rentals = await account.getRentals();
        expect(rentals[tkIndex.toNumber()].endTime).to.eq(block.timestamp + maxDuration/5);
        
    })

    it("should increment list of rentals", async () => {
        const duration = 1000/5;
        const startTime = (await provider.getBlock('latest')).timestamp;
        const rentals = await account.getRentals();
        expect(rentals[1].contract_).to.eq(nft.address);
        expect(rentals[1].id).to.eq(newerToken);
        expect(rentals[1].lender).to.eq(mktPlace.address);
        expect(rentals[1].startTime).to.eq(startTime);
        expect(rentals[1].endTime).to.eq(startTime + duration);
        const endTime = await account.getEndTime(nft.address, newerToken);
        expect(endTime).to.eq(startTime + duration);
    })

    it("should decrement list of rentals / update index in struct and mapping", async () => {
        oneMoreToken = await mint(nft, signer_2, signer_1.address);
        const price = ethers.utils.parseEther('0.00001');
        const maxDuration = 1000;
        // 1st listing
        let approve = await nft.connect(signer_1).approve(mktPlace.address, oneMoreToken);
        await approve.wait();

        let listTx = await mktPlace.connect(signer_1).listNFT(nft.address, oneMoreToken, price, maxDuration );
        await listTx.wait();
        
        const rentalsBefore = await account.getRentals();

        let rentTx = await rentNFT(
            account,
            owner,
            mktPlace,
            nft.address,
            oneMoreToken,
            1,
            price.toNumber()
        );

        const rentalsAfter = await account.getRentals();
        expect(rentalsAfter.length).to.eq(rentalsBefore.length + 1);
        expect(await account.getTokenIndex(nft.address, oneMoreToken)).to.eq(rentalsAfter.length - 1);
        const endTime = await account.getEndTime(nft.address, newToken)
        // console.log('endTime', endTime.toString());
        await mine(10, {interval: 20});
        const block = await provider.getBlock('latest');
        expect(endTime.lt(block.timestamp))
        const _index = await account.getTokenIndex(nft.address, newToken);
        const release = await account.connect(owner).releaseSingleAsset(_index);
        await release.wait();
        const rentalsAfterRelease = await account.getRentals();
        expect(rentalsAfterRelease.length).to.eq(rentalsAfter.length - 1);
        const replacerIndex = await account.getTokenIndex(nft.address, oneMoreToken);
        expect(replacerIndex).to.eq(_index);
        expect(rentalsAfterRelease[_index.toNumber()].index).to.eq(_index);
        
        
    })

    it("should block transfers and approvals for rentals", async () => {
        const abi = [
            "function transferFrom(address from,address to,uint256 tokenId)"
        ]
        const iface = new ethers.utils.Interface(abi);
        const calldata_ = iface.encodeFunctionData("transferFrom", [
            account.address,
            signer_2.address,
            oneMoreToken
        ]);
        await expect( 
            account.connect(owner).execute(nft.address, 0, calldata_ ) 
        ).to.be.revertedWith("Unauthorized operation");
        //
        const abi_0 = [
            "function safeTransferFrom(address from,address to,uint256 tokenId,bytes data)"
        ]
        const iface_0 = new ethers.utils.Interface(abi_0);
        const calldata_0 = iface_0.encodeFunctionData("safeTransferFrom", [
            account.address,
            signer_2.address,
            oneMoreToken,
            "0x00"
        ]);
        await expect( 
            account.connect(owner).execute(nft.address, 0, calldata_0 ) 
        ).to.be.revertedWith("Unauthorized operation");
        //
        const abi_1 = [
            "function safeTransferFrom(address from,address to,uint256 tokenId)"
        ];
        const iface_1 = new ethers.utils.Interface(abi_1);
        const calldata_1 = iface_1.encodeFunctionData("safeTransferFrom", [
            account.address,
            signer_2.address,
            oneMoreToken            
        ]);
        await expect( 
            account.connect(owner).execute(nft.address, 0, calldata_1 ) 
        ).to.be.revertedWith("Unauthorized operation");
        //
        const abi_2 = [
            "function approve(address to,uint256 tokenId)"
        ];
        const iface_2 = new ethers.utils.Interface(abi_2);
        const calldata_2= iface_2.encodeFunctionData("approve", [
            signer_2.address,
            oneMoreToken
        ]);
        await expect(
            account.connect(owner).execute(nft.address, 0 , calldata_2)
        ).to.be.revertedWith("Unauthorized operation");
        //
        
    });

    it("should restrict setting operators for nft contracts with rentalCounter greater than zero", 
      async () => {
        const abi = [
            "function setApprovalForAll(address operator,bool approved)"
        ]
        const iface = new ethers.utils.Interface(abi);
        const calldata_ = iface.encodeFunctionData("setApprovalForAll", [
            signer_2.address,
            true
        ]);
        await expect(
            account.connect(owner).execute(nft.address, 0 , calldata_)
        ).to.be.revertedWith("Unauthorized operation");    
    });

    it("should allow owner to release nft back to signer_1", async () => {
        let rentals_ = await account.getRentals();
        const rentalCount = rentals_.length; 
        
        let index = 0;
        await expect(account.connect(signer_2).releaseSingleAsset(index))
            .to.be.revertedWith("only owner");
        const abi = [
            "function releaseSingleAsset(uint256 index)"
        ]
        const iface = new ethers.utils.Interface(abi);
        // 1st release
        let calldata_ = iface.encodeFunctionData("releaseSingleAsset", [index]);
        
        let releaseTx = await account.connect(owner).execute(account.address, 0, calldata_);
        releaseTx.wait();

        let newNftOwner = await nft.ownerOf(newToken);
        expect(newNftOwner).to.eq(mktPlace.address);
        rentals_ = await account.getRentals();
        expect(rentals_.length).to.eq(rentalCount - 1);

        // 2nd release
        calldata_ = iface.encodeFunctionData("releaseSingleAsset", [index]);
        
        releaseTx = await account.connect(owner).execute(account.address, 0, calldata_);
        releaseTx.wait();

        newNftOwner = await nft.ownerOf(newToken);
        expect(newNftOwner).to.eq(mktPlace.address);
        rentals_ = await account.getRentals();
        expect(rentals_.length).to.eq(rentalCount - 2);

    });

    it("should allow setting operators for nft contracts with rentalCounter equal zero / update count",
        async () => {
            const _rentals = await account.getRentals();
            expect(_rentals.length).to.eq(0);
            
            let abi = [
                "function setApprovalForAll(address operator,bool approved)"
            ]
            let iface = new ethers.utils.Interface(abi);
            let calldata_ = iface.encodeFunctionData("setApprovalForAll", [
                signer_2.address,
                true
            ]);
            let tx = await account.connect(owner).execute(nft.address, 0 , calldata_);
            tx.wait();
            let opCount = await account.getOperatorCount(nft.address);
            expect(opCount).to.eq(1);
            abi = [
                "function setApprovalForAll(address operator,bool approved)"
            ]
            iface = new ethers.utils.Interface(abi);
            calldata_ = iface.encodeFunctionData("setApprovalForAll", [
                signer_2.address,
                false
            ]);
            tx = await account.connect(owner).execute(nft.address, 0 , calldata_);
            tx.wait();
            opCount = await account.getOperatorCount(nft.address);
            expect(opCount).to.eq(0);
        }
    );

    it("should allow nft to be pulled after endTime / should block before", async () => {
        const price = 1000;
        const duration = 150;
        await rentNFT(account, owner, mktPlace, nft.address, newToken, duration, price);
        
        const index = 0;
        const loans = await account.getRentals();
        console.log(' ==> endTime', loans[0].endTime.toString());
        let blockTime = (await provider.getBlock('latest')).timestamp;
        console.log(' ==> current blockTime', blockTime);
        
        await expect(
            account.connect(signer_2).pullAsset(index)
        ).to.be.revertedWith("Loan duration not reached");
        console.log('pull blocked');
        // 
        await mine(10, {interval: 20});
        blockTime = (await provider.getBlock('latest')).timestamp;
        console.log(' ==> blockTime after mining', blockTime);
        const receiver = loans[index].lender;
        await account.connect(signer_2).pullAsset(index);
        const nftOwner = await nft.ownerOf(newToken);
        expect(nftOwner).to.eq(receiver);
        console.log('pull worked');
    });
});