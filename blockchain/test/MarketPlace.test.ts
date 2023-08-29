import { ethers } from "hardhat";
import { expect } from "chai";
import { 
    RWalletFactory,
    RWalletFactory__factory,
    NFT__factory,
    NFT,
    MarketPlace__factory,
    MarketPlace,
    RWallet
} from "../typechain";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { BigNumber, Contract } from "ethers";
import { deployFactory, nftDeployAndMint, deployMktPlace, createWallet } from "./rWallet-testutils";

describe("Testing MarketPlace", function () {
    let factory: RWalletFactory;
    let nft: NFT;
    let mktPlace: MarketPlace;
    let wallet: Contract;
    let owner: SignerWithAddress;
    let dummy: SignerWithAddress;
    let lender: SignerWithAddress;
    let entryPoint: SignerWithAddress;
    let tokenId: BigNumber;
    const feeBase = 1000;
    const feeMul = 3;
    const provider = ethers.provider;
    
    before(async () => {
        [owner, entryPoint, dummy, lender] = await ethers.getSigners();
        factory = await deployFactory(dummy, entryPoint.address);
        [nft, tokenId] = await nftDeployAndMint(dummy, lender.address);
        mktPlace = await deployMktPlace(dummy, factory.address, feeBase, feeMul);
        wallet = await createWallet(factory, owner.address);
        const nft1owner = await nft.ownerOf(tokenId);
        expect(nft1owner).to.eq(lender.address);
    });
    
});