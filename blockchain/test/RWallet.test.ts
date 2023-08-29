import { ethers } from "hardhat";
import { expect } from "chai";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { RWallet__factory, RWallet, NFT__factory, NFT } from "../typechain";
import { BigNumber } from "ethers";
import { mine } from "@nomicfoundation/hardhat-network-helpers";

describe("Testing Wallet", function () {
    
        const provider = ethers.provider;
        let owner: SignerWithAddress;
        let lender: SignerWithAddress;
        let dummy: SignerWithAddress;
        let walletFactory: RWallet__factory;
        let wallet: RWallet;
        let nftFactory: NFT__factory;
        let nft: NFT;
        let tokenId: BigNumber;

        
    before(async () => {
        [owner, lender, dummy] = await ethers.getSigners();
        walletFactory = new RWallet__factory(owner);
        wallet = await walletFactory.deploy(owner.address);
        await wallet.deployTransaction.wait();
        console.log(`\nwallet deployed at ${wallet.address}\n`);
        nftFactory = new NFT__factory(dummy);
        nft = await nftFactory.deploy();
        await nft.deployTransaction.wait();
        console.log(`nft deployed at ${nft.address}\n`);
        const mintTx = await nft.connect(dummy).safeMint(lender.address);
        const mintReceipt = await mintTx.wait();
        const mintEvent = mintReceipt.events?.find(
                (event: any) => event.event === 'Transfer'
            );
        tokenId = mintEvent?.args?.tokenId;
        const nft1owner = await nft.ownerOf(tokenId);
        expect(nft1owner).to.eq(lender.address);
        console.log(`\nnft ${tokenId} minted to ${lender.address}\n`);
    });

    it("should be owned by owner/entryPoint", async () => {
        const ownerFromGetter = await wallet.entryPoint();
        expect(ownerFromGetter).to.eq(owner.address);
    });

    it("should make simple transfers", async () => {
        await owner.sendTransaction({to: wallet.address, value: ethers.utils.parseEther('1')});
        const dummyBal_0 = await provider.getBalance(dummy.address);
        const transferValue = ethers.utils.parseEther('0.5');
        const tx = await wallet.execute(dummy.address, transferValue, "0x");
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
        const tx = await wallet.execute(nft.address, 0, calldata_ );
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
        ]
        const iface_ = new ethers.utils.Interface(abi_);
        const calldata__ = iface_.encodeFunctionData("transferFrom", [
            lender.address,
            dummy.address,
            tokenId    
        ]);
        await expect(wallet.connect(dummy).execute(nft.address, 0, calldata__)).to.be.revertedWith("account: not Owner or EntryPoint");
        
    });

    it("should update list of loans", async () => {
        const duration = 10000;
        const startTime = (await provider.getBlock('latest')).timestamp;
        const updateTx = await wallet.uponNFTLoan(nft.address, tokenId, lender.address, duration);
        updateTx.wait();
        const loans = await wallet.getLoansByContract(nft.address);
        expect(loans[0].contract_).to.eq(nft.address);
        expect(loans[0].id).to.eq(tokenId);
        expect(loans[0].lender).to.eq(lender.address);
        expect(loans[0].startTime).to.eq(startTime + 1); // 1 time unit difference
        expect(loans[0].endTime).to.eq(startTime + duration + 1);
    })

    it("should block transfers and approvals for loans", async () => {
        const abi = [
            "function transferFrom(address from,address to,uint256 tokenId)"
        ]
        const iface = new ethers.utils.Interface(abi);
        const calldata_ = iface.encodeFunctionData("transferFrom", [
            wallet.address,
            dummy.address,
            tokenId
        ]);
        await expect( 
            wallet.execute(nft.address, 0, calldata_ ) 
        ).to.be.revertedWith("Unauthorized operation");
        //
        const abi_0 = [
            "function safeTransferFrom(address from,address to,uint256 tokenId,bytes data)"
        ]
        const iface_0 = new ethers.utils.Interface(abi_0);
        const calldata_0 = iface_0.encodeFunctionData("safeTransferFrom", [
            wallet.address,
            dummy.address,
            tokenId,
            "0x00"
        ]);
        await expect( 
            wallet.execute(nft.address, 0, calldata_0 ) 
        ).to.be.revertedWith("Unauthorized operation");
        //
        const abi_1 = [
            "function safeTransferFrom(address from,address to,uint256 tokenId)"
        ];
        const iface_1 = new ethers.utils.Interface(abi_1);
        const calldata_1 = iface_1.encodeFunctionData("safeTransferFrom", [
            wallet.address,
            dummy.address,
            tokenId            
        ]);
        await expect( 
            wallet.execute(nft.address, 0, calldata_1 ) 
        ).to.be.revertedWith("Unauthorized operation");
        //
        const abi_2 = [
            "function approve(address to,uint256 tokenId)"
        ];
        const iface_2 = new ethers.utils.Interface(abi_2);
        const calldata_2= iface_2.encodeFunctionData("approve", [
            dummy.address,
            tokenId
        ]);
        await expect(
            wallet.execute(nft.address, 0 , calldata_2)
        ).to.be.revertedWith("Unauthorized operation");
        //
        const abi_3 = [
            "function setApprovalForAll(address operator, bool approved)"
        ]
        const iface_3 = new ethers.utils.Interface(abi_3);
        const calldata_3 = iface_3.encodeFunctionData("setApprovalForAll", [
            dummy.address,
            true
        ]);
        await expect(
            wallet.execute(nft.address, 0 , calldata_3)
        ).to.be.revertedWith("Unauthorized operation");
    });

    it("should restrict setting operators for loan nft contracts", async () => {
        const abi = [
            "function setApprovalForAll(address operator,bool approved)"
        ]
        const iface = new ethers.utils.Interface(abi);
        const calldata_ = iface.encodeFunctionData("setApprovalForAll", [
            dummy.address,
            true
        ]);
        await expect(
            wallet.execute(nft.address, 0 , calldata_)
        ).to.be.revertedWith("Unauthorized operation");    
    });

    it("should allow owner to release nft back to lender", async () => {
        const index = 0;
        await expect(wallet.connect(dummy).releaseSingleAsset(nft.address,index))
            .to.be.revertedWith("only owner");
        const abi = [
            "function releaseSingleAsset(address contract_,uint256 index)"
        ]
        const iface = new ethers.utils.Interface(abi);
        const calldata_ = iface.encodeFunctionData("releaseSingleAsset", [
            nft.address,
            index
        ]);
        
        const releaseTx = await wallet.execute(wallet.address, 0, calldata_);
        //  wallet.releaseSingleAsset(index);
        releaseTx.wait();
        const newNftOwner = await nft.ownerOf(tokenId);
        expect(newNftOwner).to.eq(lender.address);
        const loans_ = await wallet.getLoans();
        expect(loans_.length).to.eq(0);
    });

    it(
        "should allow setting operators for nft contracts with no loan and update count",
        async () => {
            let abi = [
                "function setApprovalForAll(address operator,bool approved)"
            ]
            let iface = new ethers.utils.Interface(abi);
            let calldata_ = iface.encodeFunctionData("setApprovalForAll", [
                dummy.address,
                true
            ]);
            let tx = await wallet.execute(nft.address, 0 , calldata_);
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
            tx = await wallet.execute(nft.address, 0 , calldata_);
            tx.wait();
            opCount = await wallet.getOperatorCount(nft.address);
            expect(opCount).to.eq(0);
        }
    );


    it("should allow nft to be pulled after endTime / should block before", async () => {
        const transfer = await nft.connect(lender).transferFrom(lender.address, wallet.address, tokenId);
        transfer.wait();
        const duration = 150;
        const update = await wallet.uponNFTLoan(
            nft.address,
            tokenId,
            lender.address,
            duration
        );
        await update.wait();
        const loans = await wallet.getLoansByContract(nft.address);
        console.log(' ==> endTime', loans[0].endTime);
        let blockTime = (await provider.getBlock('latest')).timestamp;
        console.log(' ==> current blockTime', blockTime);
        const index = 0;
        await expect(
            wallet.connect(dummy).pullAsset(nft.address, index)
        ).to.be.revertedWith("Loan duration not reached");

        await mine(10, {interval: 20});
        blockTime = (await provider.getBlock('latest')).timestamp;
        console.log(' ==> blockTime after mining', blockTime);
        const pullTx = await wallet.connect(dummy).pullAsset(nft.address, index);
        pullTx.wait();
        const nftOwner = await nft.ownerOf(tokenId);
        expect(nftOwner).to.eq(lender.address);
    });
});