import { BigNumber, ethers } from "ethers";
import * as dotenv from 'dotenv';
// import * as mktPlace from '../deployments/aurora_testnet/BaseMarketPlace.json';
// import * as nft from '../deployments/aurora_testnet/NFT.json';
import * as mktPlace from '../deployments/sepolia/BaseMarketPlace.json';
import * as nft from '../deployments/sepolia/NFT.json';
import uri from "../../nft/URI.json"
dotenv.config();

const pkey = process.env.PRIVATE_KEY;
const apikey = process.env.INFURA_API_KEY;
// const nftAddress = '0xc0F0aF132d3088cCF7379c32206A54f850f1Eba6';
const walletAddress = '0xf36D84389b2c6846189fBe64dEfBd201f512205A';
const dummy1 = '0x099A294Bffb99Cb2350A6b6cA802712D9C96676A';
const aurora_silo_url = 'https://hackathon.aurora.dev';
const aurora_testnet_url = 'https://testnet.aurora.dev';

// const provider = new ethers.providers.JsonRpcProvider(aurora_testnet_url);

const main = async () => {
    if(!pkey || !apikey) throw new Error('missing env');
    const provider = new ethers.providers.InfuraProvider('sepolia', );
    const signer =  new ethers.Wallet(pkey, provider);
    const addr = await signer.getAddress();
    const nftContract = new ethers.Contract(nft.address, nft.abi, signer);
    const contract = new ethers.Contract(mktPlace.address, mktPlace.abi, signer);
    // console.log(nft.address);
    console.log('pubkey', addr);
    // const iface = new ethers.utils.Interface([
    //     'function ownerOf(uint256 tokenId) public view virtual override returns (address)'
    // ]);
    // const to = '0x623Fd2C30ccBE58110268972E1c9fe3825d39e15';
    const tokenId = await nftContract.totalSupply();
    console.log('tokenId', tokenId.toString());

    
    console.log('\nminting...');
    const mint = await nftContract.safeMint(addr, uri.sword);
    const mint_receipt = await mint.wait();
    console.log(mint_receipt);
    // const tx = await nftContract.transferFrom(dummy1, dummy1, 2);
    
    // console.log(`\ntransfering token ${tokenId}...`);
    // const transfer = await nftContract.transferFrom(dummy1, walletAddress, tokenId);
    // const trReceipt = await transfer.wait()
    // console.log(trReceipt);

    console.log(`\napproving token ${tokenId}...`);
    const approve = await nftContract.approve(mktPlace.address, tokenId);
    const appReceipt = await approve.wait();
    console.log(appReceipt);
    const appr = await nftContract.getApproved(tokenId)
    console.log(`approved? token ${tokenId}`, appr == mktPlace.address);

    console.log('\nlending...');
    const price = ethers.utils.parseEther('0.0000002');
    const tx = await contract.lendNFT(nft.address, tokenId, price, 36*60);
    const receipt = await tx.wait();
    console.log(receipt);
    
    // console.log(await nftContract.getApproved(tokenId));
    // console.log('mktPlace assets', await contract.getAssets()); 
    
    // console.log(`\nowner check token ${tokenId}`);
    // const nftOwner = await nftContract.ownerOf(tokenId);
    // console.log(nftOwner == walletAddress);
    // console.log((await nftContract.totalSupply()).toString());

    // console.log(await provider.getFeeData());

    // console.log(ethers.utils.id("WalletCreated(address,address)") == '0x5b03bfed1c14a02bdeceb5fa582eb1a5765fc0bc64ca0e6af4c20afc9487f081');
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});