
# rWallet 
## NFT Rentals Using Account Abstraction: NO COLLATERAL NEEDED

**TL;DR**

This is a SC wallet/dapp that enables NFT rentals entirely on-chain and in a trustless manner. No colateral needed.

We are leveraging Acount Abstaction TO ENABLE users to rent NFTs without any collateral, operating in a fully trustless environment. While still in the development phase, we've successfully launched a proof of concept (POC) on Base Goerli. This includes a browser extension wallet, a dashboard/marketplace dapp, and fully operational smart contracts. 

Below you can find a guide on how to run the POC.

## Contents
- [Guide](https://github.com/pbfranceschin/r-wallet-base-3/tree/main#guide)
- [About the Project](https://github.com/pbfranceschin/r-wallet-base-3/tree/main#about-the-project)
- [Main Use Cases](https://github.com/pbfranceschin/r-wallet-base-3/tree/main#main-use-cases)
- [Impact](https://github.com/pbfranceschin/r-wallet-base-3/tree/main#impact)
- [To be Done](https://github.com/pbfranceschin/r-wallet-base-3/tree/main#to-be-done)

## Guide
To run the POC, 1st clone this repo runnning the command below,
```
git clone https://github.com/pbfranceschin/r-wallet-base-3.git
```
then enter the `browserExtension` dir,
```
cd browserExtension
```
and install all dependencies.
```
yarn install
```
To build the browser extension app, run
```
yarn start
```
After the building process is done, open your chrome browser and click on config on the top right and select *Extensions* -> *Manage Extensions*. In the extensions tab turn on *developer mode* on the top right. Then select *Load unpacked* in the top left. On the seleciton window, enter the root folder of this repo then `browserExtension/build/` and hit select.

After this you might be able to run our version of [trampoline](https://github.com/eth-infinitism/trampoline) extension. Now create an account, fund it and deploy it following the instructions provided in the screen.

Now head to our [test account dashboard](https://r-wallet-base-3.vercel.app/dashboard/0x099A294Bffb99Cb2350A6b6cA802712D9C96676A) and checkout some test NFTs for rent. To rent, just click in the NFT card, input a duration for the rent and click the button!

*Feel free to contact any of the team members if you run into any errors or are interested in collaborating.* 


## About the Project

*How Does It Work?*

NFT owners can utilize our dapp to list their NFTs for rent. In turn, our SC wallet users can rent these for a specified duration. Asset owners can be confident in receiving payment and having their assets returned post-lease, all thanks to our robust smart contracts.

How is this achieved? Our Smart Contract Wallet ensures the rented NFT remains within the renting account until the rental period concludes. When the rent is due, the NFT is directed solely to its rightful owner.

We've also streamlined the process for any marketplace dapp to integrate seamlessly with our wallet. [Check here for details](https://github.com/pbfranceschin/r-wallet-base-3/tree/main/blockchain#compatibility).

Checkout our documentation [here](https://github.com/pbfranceschin/r-wallet-base-3/blob/main/blockchain/README.md).

## Main Use Cases

- **Gaming:** The burgeoning gameFi sector underscores the relevance of our application, especially as most games employ NFTs as in-game assets. NFT owners can monetize their assets during inactive periods.

- **Metaverse Items:** Any item within the metaverse represented as an NFT can benefit immensely from our protocol. Anticipate a shakeup in the metaverse economy!

- **Access Tokens:** In certain scenarios, NFTs serve as access control mechanisms. NFT holders gain privileges or rights, such as the BAYC, which grants its holders exclusive community access and future entry to their metaverse.

## Impact

The implications of our project are clear-cut. It unveils the inherent value of assets that are, or can be, represented as NFTs, encompassing both current and prospective cases. Upon our launch, any asset owner can potentially generate passive income, provided there's genuine demand for their assets.

## To be done

- Include buying and selling NFT's
- Include methods for updating listing metadata
- Start bulding mobile app
