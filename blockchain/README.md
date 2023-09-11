# wallet_name documentation
wallet_name works in accordance with [ERC-4337](https://eips.ethereum.org/EIPS/eip-4337). This means it uses bundlers and an entryPoint to send execution calls to each wallet contract. The call requests are handled by the app. Below you can see a high-level overview of how the protocol works on-chain.

## Architecture
The protocol is composed by three main entities: the *factory*, the *wallet* and the *market place*. The **factory** is a smart contract that handles wallet creation and it is called everytime a user opens a new account. The **wallet** is also a contract that is deployed by the factory when a new account should be created. The wallet implementation is stored by the facory contract and everyone is the same. The **market place** is also a smart contract that handles specific types of transaction envolving wallet contracts, namely NFT rental transactions. To enable a fully functioning



Implementation of contracts for [ERC-4337](https://eips.ethereum.org/EIPS/eip-4337) account abstraction via alternative mempool.

# Resources

[Vitalik's post on account abstraction without Ethereum protocol changes](https://medium.com/infinitism/erc-4337-account-abstraction-without-ethereum-protocol-changes-d75c9d94dc4a)

[Discord server](http://discord.gg/fbDyENb6Y9)

[Bundler reference implementation](https://github.com/eth-infinitism/bundler)

[Bundler specification test suite](https://github.com/eth-infinitism/bundler-spec-tests)
