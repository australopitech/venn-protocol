import { ethers } from "hardhat";
import { expect } from "chai";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { 
    RWalletFactory__factory, RWalletFactory, RWallet, NFT__factory, NFT, MarketPlace, ReceiptNFT
} from "../typechain";
import { BigNumber, Contract } from "ethers";
import { mine } from "@nomicfoundation/hardhat-network-helpers";
import { deployFactory, createWallet, rentNFT, deployReceiptsContract, deployMktPlace, nftDeployAndMint } from "./rWallet-testutils";

describe.skip("Testing Wallet", function () {
    
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
        let receiptsContract: ReceiptNFT;
        let mktPlace: MarketPlace;
        const entryPoint = ethers.utils.getAddress(ethers.utils.ripemd160("0x"));
        const feeBase = 1000;
        const feeMul = 3;
        const pullFeeBase = 3;
        const pullFeeMul = 1;
        

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

        walletFactory = await deployFactory(dummy, entryPoint);
        
        wallet = await createWallet(walletFactory, owner.address);
        console.log(`\nwallet deployed at ${wallet.address}\n`);
        
        [nft, tokenId] = await nftDeployAndMint(dummy, lender.address);

        receiptsContract = await deployReceiptsContract(dummy);
        mktPlace = await  deployMktPlace(
            dummy, walletFactory.address, receiptsContract.address, feeBase, feeMul, pullFeeBase, pullFeeMul
        );
        const role = ethers.utils.id("MINTER_ROLE");
        const grantRole = await receiptsContract.connect(dummy).grantRole(role, mktPlace.address);
        
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
        // const dummyBal_1 = await provider.getBalance(dummy.address);
        expect(await provider.getBalance(dummy.address))
         .to.eq(dummyBal_0.add(transferValue));
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
        
        const fee = price.mul(maxDuration/10).mul(feeMul).div(feeBase);
        const value = price.mul(maxDuration/10).add(fee);
        // console.log(value.toString());

        const one_eth = ethers.utils.parseEther('1');
        const fund = await owner.sendTransaction({to: wallet.address, value: value.add(one_eth)});
        await fund.wait();

        await rentNFT(
            wallet,
            owner,
            mktPlace,
            nft.address,
            newToken,
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
        expect(loans[0].lender).to.eq(mktPlace.address);
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
        expect(newNftOwner).to.eq(mktPlace.address);
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
        const price = 1000;
        const duration = 150;
        await rentNFT(wallet, owner, mktPlace, nft.address, newToken, duration, price);
        
        const index = 0;
        const loans = await wallet.getLoans();
        console.log(' ==> endTime', loans[0].endTime);
        let blockTime = (await provider.getBlock('latest')).timestamp;
        console.log(' ==> current blockTime', blockTime);
        
        await expect(
            wallet.connect(dummy).pullAsset(index)
        ).to.be.revertedWith("Loan duration not reached");
        console.log('pull blocked');
        // 
        await mine(10, {interval: 20});
        blockTime = (await provider.getBlock('latest')).timestamp;
        console.log(' ==> blockTime after mining', blockTime);
        const receiver = loans[index].lender;
        await wallet.connect(dummy).pullAsset(index);
        const nftOwner = await nft.ownerOf(newToken);
        expect(nftOwner).to.eq(receiver);
        console.log('pull worked');
    });
});