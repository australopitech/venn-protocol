import { ethers } from "hardhat";
import { expect } from "chai";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { 
    RWalletFactory__factory, RWalletFactory, RWallet__factory, RWallet, NFT__factory, NFT, MarketPlace__factory, MarketPlace
} from "../typechain";
import { BigNumber, Contract } from "ethers";
import { mine } from "@nomicfoundation/hardhat-network-helpers";
import { createWallet, rentNFT } from "./rWallet-testutils";

describe("Testing Wallet", function () {
    
        const provider = ethers.provider;
        let owner: SignerWithAddress;
        let lender: SignerWithAddress;
        let dummy: SignerWithAddress;
        let walletFactory: RWalletFactory;
        let wallet: RWallet;
        let nftFactory: NFT__factory;
        let nft: NFT;
        let tokenId: BigNumber;
        let newToken: BigNumber;
        let uri = "uri";
        let mktPlace: MarketPlace;
        const entryPoint = ethers.utils.getAddress(ethers.utils.ripemd160("0x"));
        const feeBase = 1000;
        const feeMul = 3;
        

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
        [owner, lender, dummy] = await ethers.getSigners();

        const factory_fatory = new RWalletFactory__factory(dummy);
        walletFactory = await factory_fatory.deploy(entryPoint);
        await walletFactory.deployTransaction.wait();
        console.log(`\nfactory deployed at ${walletFactory.address}\n`);

        // const walletDeployer = new RWallet__factory(owner);
        // wallet = await walletDeployer.deploy(owner.address);
        // await wallet.deployTransaction.wait();
        wallet = await createWallet(walletFactory, owner.address);
        console.log(`\nwallet deployed at ${wallet.address}\n`);
        
        nftFactory = new NFT__factory(dummy);
        nft = await nftFactory.deploy();
        await nft.deployTransaction.wait();
        console.log(`\nnft deployed at ${nft.address}\n`);
        
        tokenId = await mint(nft, dummy, lender.address);
        // const mintTx = await nft.connect(dummy).safeMint(lender.address, uri);
        // const mintReceipt = await mintTx.wait();
        // const mintEvent = mintReceipt.events?.find(
        //         (event: any) => event.event === 'Transfer'
        //     );
        // tokenId = mintEvent?.args?.tokenId;
        // const nft1owner = await nft.ownerOf(tokenId);
        // expect(nft1owner).to.eq(lender.address);
        // console.log(`\nnft ${tokenId} minted to ${lender.address}\n`);

        const mktPlaceFactory = new MarketPlace__factory(dummy);
        mktPlace = await mktPlaceFactory.deploy(walletFactory.address, feeBase, feeMul);
        await mktPlace.deployTransaction.wait();
        console.log(`\nmktPlace deployed at ${mktPlace.address}\n`);
    });

    it("should be owned by owner", async () => {
        const ownerFromGetter = await wallet.owner();
        expect(ownerFromGetter).to.eq(owner.address);
    });

    it("should make simple transfers", async () => {
        await owner.sendTransaction({to: wallet.address, value: ethers.utils.parseEther('1')});
        const dummyBal_0 = await provider.getBalance(dummy.address);
        const transferValue = ethers.utils.parseEther('0.5');
        const tx = await wallet.connect(owner).execute(dummy.address, transferValue, "0x");
        await tx.wait();
        const dummyBal_1 = await provider.getBalance(dummy.address);
        expect(dummyBal_1).to.eq(dummyBal_0.add(transferValue));
    });

    it("should make external calls", async () => {
        const approveTx = await nft.connect(lender).approve(wallet.address, tokenId);
        await approveTx.wait();
        const approved = await nft.getApproved(tokenId);
        expect(approved).to.eq(wallet.address);
        const abi = [
            "function safeTransferFrom(address from,address to,uint256 tokenId)"
        ]
        const iface = new ethers.utils.Interface(abi);
        const calldata_ = iface.encodeFunctionData("safeTransferFrom", [
            lender.address,
            wallet.address,
            tokenId            
        ])
        const tx = await wallet.connect(owner).execute(nft.address, 0, calldata_ );
        await tx.wait();
        const newOwner = await nft.ownerOf(tokenId);
        expect(newOwner).to.eq(wallet.address);
    });
    // tests _beforeCallCheck directly: does not run when the function is private
    it.skip("test beforeCallCheck", async () => {
        const abi = [
            "function setApprovalForAll(address operator, bool approved)"
        ]
        const iface = new ethers.utils.Interface(abi);
        const calldata_ = iface.encodeFunctionData("setApprovalForAll", [
            dummy.address,
            true,    
        ]);
        // const check = await wallet._beforeCallCheck(calldata_);
        // console.log(check);
        ////////
        const abi_ = [
            "function transferFrom(address from, address to, uint256 tokenId)"
        ]
        const iface_ = new ethers.utils.Interface(abi_);
        const calldata__ = iface_.encodeFunctionData("transferFrom", [
            lender.address,
            dummy.address,
            tokenId    
        ]);
        // const check_ = await wallet._beforeCallCheck(calldata__);
        // console.log(check_);
    });

    it("should restrict execute calls to onlyOwner", async () => {
        const abi_ = [
            "function transferFrom(address from, address to, uint256 tokenId)"
        ];
        const iface_ = new ethers.utils.Interface(abi_);
        const calldata__ = iface_.encodeFunctionData("transferFrom", [
            lender.address,
            dummy.address,
            tokenId    
        ]);
        await expect(wallet.connect(dummy).execute(nft.address, 0, calldata__))
         .to.be.revertedWith("account: not Owner or EntryPoint");
    });

    it("should be able to rent NFT's in MarketPlace", async () => {
        newToken = await mint(nft, dummy, lender.address);
        
        const price = ethers.utils.parseEther('0.00001');
        const maxDuration = 1000;
        const approve = await nft.connect(lender).approve(mktPlace.address, newToken);
        await approve.wait();

        const listTx = await mktPlace.connect(lender).listNFT(nft.address, newToken, price, maxDuration );
        await listTx.wait();

        const assets = await mktPlace.getAssets();
        expect(assets[0].contract_).to.eq(nft.address);
        expect(assets[0].nftOwner).to.eq(lender.address);

        
        const fee = price.mul(maxDuration/10).mul(feeMul).div(feeBase);
        const value = price.mul(maxDuration/10).add(fee);
        // console.log(value.toString());

        const one_eth = ethers.utils.parseEther('1');
        const fund = await owner.sendTransaction({to: wallet.address, value: value.add(one_eth)});
        await fund.wait();

        const rentTx = await rentNFT(
            wallet,
            owner,
            mktPlace,
            nft.address,
            newToken.toNumber(),
            lender.address,
            maxDuration/10,
            price.toNumber()
        );

        const newOwner = await nft.ownerOf(newToken);
        expect(newOwner).to.eq(wallet.address);

    })

    it("should update list of rentals", async () => {
        const duration = 100;
        const startTime = (await provider.getBlock('latest')).timestamp;
        const loans = await wallet.getLoans();
        expect(loans[0].contract_).to.eq(nft.address);
        expect(loans[0].id).to.eq(newToken);
        expect(loans[0].lender).to.eq(lender.address);
        expect(loans[0].startTime).to.eq(startTime);
        expect(loans[0].endTime).to.eq(startTime + duration);
    })

    it("should block transfers and approvals for loans", async () => {
        const abi = [
            "function transferFrom(address from,address to,uint256 tokenId)"
        ]
        const iface = new ethers.utils.Interface(abi);
        const calldata_ = iface.encodeFunctionData("transferFrom", [
            wallet.address,
            dummy.address,
            newToken
        ]);
        await expect( 
            wallet.connect(owner).execute(nft.address, 0, calldata_ ) 
        ).to.be.revertedWith("Unauthorized operation");
        //
        const abi_0 = [
            "function safeTransferFrom(address from,address to,uint256 tokenId,bytes data)"
        ]
        const iface_0 = new ethers.utils.Interface(abi_0);
        const calldata_0 = iface_0.encodeFunctionData("safeTransferFrom", [
            wallet.address,
            dummy.address,
            newToken,
            "0x00"
        ]);
        await expect( 
            wallet.connect(owner).execute(nft.address, 0, calldata_0 ) 
        ).to.be.revertedWith("Unauthorized operation");
        //
        const abi_1 = [
            "function safeTransferFrom(address from,address to,uint256 tokenId)"
        ];
        const iface_1 = new ethers.utils.Interface(abi_1);
        const calldata_1 = iface_1.encodeFunctionData("safeTransferFrom", [
            wallet.address,
            dummy.address,
            newToken            
        ]);
        await expect( 
            wallet.connect(owner).execute(nft.address, 0, calldata_1 ) 
        ).to.be.revertedWith("Unauthorized operation");
        //
        const abi_2 = [
            "function approve(address to,uint256 tokenId)"
        ];
        const iface_2 = new ethers.utils.Interface(abi_2);
        const calldata_2= iface_2.encodeFunctionData("approve", [
            dummy.address,
            newToken
        ]);
        await expect(
            wallet.connect(owner).execute(nft.address, 0 , calldata_2)
        ).to.be.revertedWith("Unauthorized operation");
        //
        
    });

    it("should restrict setting operators for nft contracts with loanCounter greater than zero", 
      async () => {
        const abi = [
            "function setApprovalForAll(address operator,bool approved)"
        ]
        const iface = new ethers.utils.Interface(abi);
        const calldata_ = iface.encodeFunctionData("setApprovalForAll", [
            dummy.address,
            true
        ]);
        await expect(
            wallet.connect(owner).execute(nft.address, 0 , calldata_)
        ).to.be.revertedWith("Unauthorized operation");    
    });

    it("should allow owner to release nft back to lender", async () => {
        const index = 0;
        await expect(wallet.connect(dummy).releaseSingleAsset(index))
            .to.be.revertedWith("only owner");
        const abi = [
            "function releaseSingleAsset(uint256 index)"
        ]
        const iface = new ethers.utils.Interface(abi);
        const calldata_ = iface.encodeFunctionData("releaseSingleAsset", [index]);
        
        const releaseTx = await wallet.connect(owner).execute(wallet.address, 0, calldata_);
        //  wallet.releaseSingleAsset(index);
        releaseTx.wait();
        const newNftOwner = await nft.ownerOf(newToken);
        expect(newNftOwner).to.eq(lender.address);
        const loans_ = await wallet.getLoans();
        expect(loans_.length).to.eq(0);
    });

    it("should allow setting operators for nft contracts with no loan / update count",
        async () => {
            let abi = [
                "function setApprovalForAll(address operator,bool approved)"
            ]
            let iface = new ethers.utils.Interface(abi);
            let calldata_ = iface.encodeFunctionData("setApprovalForAll", [
                dummy.address,
                true
            ]);
            let tx = await wallet.connect(owner).execute(nft.address, 0 , calldata_);
            tx.wait();
            let opCount = await wallet.getOperatorCount(nft.address);
            expect(opCount).to.eq(1);
            abi = [
                "function setApprovalForAll(address operator,bool approved)"
            ]
            iface = new ethers.utils.Interface(abi);
            calldata_ = iface.encodeFunctionData("setApprovalForAll", [
                dummy.address,
                false
            ]);
            tx = await wallet.connect(owner).execute(nft.address, 0 , calldata_);
            tx.wait();
            opCount = await wallet.getOperatorCount(nft.address);
            expect(opCount).to.eq(0);
        }
    );

    it("should allow nft to be pulled after endTime / should block before", async () => {
        const maxDuration = 1000;
        const price = 1000;
        const approve = await nft.connect(lender).approve(mktPlace.address, newToken);
        approve.wait();
        const listTx = await mktPlace.connect(lender).listNFT(nft.address, newToken, price, maxDuration );
        await listTx.wait();

        const duration = 150;
        await rentNFT(wallet, owner, mktPlace, nft.address, newToken.toNumber(), lender.address, duration, price);
        
        const loans = await wallet.getLoans();
        console.log(' ==> endTime', loans[0].endTime);
        let blockTime = (await provider.getBlock('latest')).timestamp;
        console.log(' ==> current blockTime', blockTime);
        const index = 0;
        await expect(
            wallet.connect(dummy).pullAsset(index)
        ).to.be.revertedWith("Loan duration not reached");

        await mine(10, {interval: 20});
        blockTime = (await provider.getBlock('latest')).timestamp;
        console.log(' ==> blockTime after mining', blockTime);
        const pullTx = await wallet.connect(dummy).pullAsset(index);
        pullTx.wait();
        const nftOwner = await nft.ownerOf(newToken);
        expect(nftOwner).to.eq(lender.address);
    });
});