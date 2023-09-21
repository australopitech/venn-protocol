import { ethers } from "hardhat";
import { expect } from "chai";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { 
    RWalletFactory__factory, RWalletFactory, RWallet, NFT__factory, NFT, MarketPlace, ReceiptNFT
} from "../typechain";
import { BigNumber, Contract } from "ethers";
import { mine } from "@nomicfoundation/hardhat-network-helpers";
import { deployFactory, createWallet, rentNFT, deployReceiptsContract, deployMktPlace, nftDeployAndMint } from "./rWallet-testutils";

describe("Testing Wallet", function () {
    
        const provider = ethers.provider;
        let owner: SignerWithAddress;
        let signer_1: SignerWithAddress;
        let signer_2: SignerWithAddress;
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

        walletFactory = await deployFactory(signer_2, entryPoint);
        
        wallet = await createWallet(walletFactory, owner.address);
        console.log(`\nwallet deployed at ${wallet.address}\n`);
        
        [nft, tokenId] = await nftDeployAndMint(signer_2, signer_1.address);

        receiptsContract = await deployReceiptsContract(signer_2);
        mktPlace = await  deployMktPlace(
            signer_2, walletFactory.address, receiptsContract.address, servAliq, pullAliq);
        const role = ethers.utils.id("MINTER_ROLE");
        const grantRole = await receiptsContract.connect(signer_2).grantRole(role, mktPlace.address);
        
    });

    it("should be owned by owner", async () => {
        const ownerFromGetter = await wallet.owner();
        expect(ownerFromGetter).to.eq(owner.address);
    });

    it("should make simple transfers", async () => {
        await owner.sendTransaction({to: wallet.address, value: ethers.utils.parseEther('1')});
        const signer_2Bal_0 = await provider.getBalance(signer_2.address);
        const transferValue = ethers.utils.parseEther('0.5');
        const tx = await wallet.connect(owner).execute(signer_2.address, transferValue, "0x");
        await tx.wait();
        // const signer_2Bal_1 = await provider.getBalance(signer_2.address);
        expect(await provider.getBalance(signer_2.address))
         .to.eq(signer_2Bal_0.add(transferValue));
    });

    it("should make external calls", async () => {
        const approveTx = await nft.connect(signer_1).approve(wallet.address, tokenId);
        await approveTx.wait();
        const approved = await nft.getApproved(tokenId);
        expect(approved).to.eq(wallet.address);
        const abi = [
            "function safeTransferFrom(address from,address to,uint256 tokenId)"
        ]
        const iface = new ethers.utils.Interface(abi);
        const calldata_ = iface.encodeFunctionData("safeTransferFrom", [
            signer_1.address,
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
            signer_1.address,
            signer_2.address,
            tokenId    
        ]);
        await expect(wallet.connect(signer_2).execute(nft.address, 0, calldata__))
         .to.be.revertedWith("account: not Owner or EntryPoint");
    });

    it("should be able to rent NFT's in MarketPlace", async () => {
        newToken = await mint(nft, signer_2, signer_1.address);
        
        const price = ethers.utils.parseEther('0.00001');
        const maxDuration = 1000;
        const approve = await nft.connect(signer_1).approve(mktPlace.address, newToken);
        await approve.wait();

        const listTx = await mktPlace.connect(signer_1).listNFT(nft.address, newToken, price, maxDuration );
        await listTx.wait();
        
        const fee = price.mul(maxDuration/10).mul(servAliq).div(10000);
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
        const rentals = await wallet.getRentals();
        expect(rentals[0].contract_).to.eq(nft.address);
        expect(rentals[0].id).to.eq(newToken);
        expect(rentals[0].lender).to.eq(mktPlace.address);
        expect(rentals[0].startTime).to.eq(startTime);
        expect(rentals[0].endTime).to.eq(startTime + duration);
    })

    it("should block transfers and approvals for rentals", async () => {
        const abi = [
            "function transferFrom(address from,address to,uint256 tokenId)"
        ]
        const iface = new ethers.utils.Interface(abi);
        const calldata_ = iface.encodeFunctionData("transferFrom", [
            wallet.address,
            signer_2.address,
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
            signer_2.address,
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
            signer_2.address,
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
            signer_2.address,
            newToken
        ]);
        await expect(
            wallet.connect(owner).execute(nft.address, 0 , calldata_2)
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
            wallet.connect(owner).execute(nft.address, 0 , calldata_)
        ).to.be.revertedWith("Unauthorized operation");    
    });

    it("should allow owner to release nft back to signer_1", async () => {
        const index = 0;
        await expect(wallet.connect(signer_2).releaseSingleAsset(index))
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
        const loans_ = await wallet.getRentals();
        expect(loans_.length).to.eq(0);
    });

    it("should allow setting operators for nft contracts with rentalCounter equal zero / update count",
        async () => {
            let abi = [
                "function setApprovalForAll(address operator,bool approved)"
            ]
            let iface = new ethers.utils.Interface(abi);
            let calldata_ = iface.encodeFunctionData("setApprovalForAll", [
                signer_2.address,
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
                signer_2.address,
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
        const loans = await wallet.getRentals();
        console.log(' ==> endTime', loans[0].endTime);
        let blockTime = (await provider.getBlock('latest')).timestamp;
        console.log(' ==> current blockTime', blockTime);
        
        await expect(
            wallet.connect(signer_2).pullAsset(index)
        ).to.be.revertedWith("Loan duration not reached");
        console.log('pull blocked');
        // 
        await mine(10, {interval: 20});
        blockTime = (await provider.getBlock('latest')).timestamp;
        console.log(' ==> blockTime after mining', blockTime);
        const receiver = loans[index].lender;
        await wallet.connect(signer_2).pullAsset(index);
        const nftOwner = await nft.ownerOf(newToken);
        expect(nftOwner).to.eq(receiver);
        console.log('pull worked');
    });
});