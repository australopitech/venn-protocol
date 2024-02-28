export declare class TransactionResponse {
    /** * The timestamp when the response was generated. Useful to show data staleness to users. */
    updated_at: Date;
    /** * The requested chain ID eg: `1`. */
    chain_id: number;
    /** * The requested chain name eg: `eth-mainnet`. */
    chain_name: string;
    /** * List of response items. */
    items: Transaction[];
    constructor(data: TransactionResponse);
}
export declare class Transaction {
    /** * The block signed timestamp in UTC. */
    block_signed_at: Date;
    /** * The height of the block. */
    block_height: number;
    /** * The requested transaction hash. */
    tx_hash: string;
    /** * The offset is the position of the tx in the block. */
    tx_offset: number;
    /** * Indicates whether a transaction failed or succeeded. */
    successful: boolean;
    from_address: string;
    from_address_label: string;
    to_address: string;
    to_address_label: string;
    /** * The value attached to this tx. */
    value: bigint | null;
    /** * The value attached in `quote-currency` to this tx. */
    value_quote: number;
    /** * A prettier version of the quote for rendering purposes. */
    pretty_value_quote: string;
    /** * The requested chain native gas token metadata. */
    gas_metadata: ContractMetadata;
    gas_offered: string;
    gas_spent: string;
    gas_price: string;
    /** * The total transaction fees (`gas_price` * `gas_spent`) paid for this tx, denoted in wei. */
    fees_paid: bigint | null;
    /** * The gas spent in `quote-currency` denomination. */
    gas_quote: number;
    /** * A prettier version of the quote for rendering purposes. */
    pretty_gas_quote: string;
    /** * The native gas exchange rate for the requested `quote-currency`. */
    gas_quote_rate: number;
    /** * The details for the dex transaction. */
    dex_details: DexReport;
    /** * The details for the NFT sale transaction. */
    nft_sale_details: NftSalesReport;
    /** * The details for the lending protocol transaction. */
    lending_details: LendingReport;
    log_events: LogEvent[];
    constructor(data: Transaction);
}
export declare class ContractMetadata {
    /** * Use contract decimals to format the token balance for display purposes - divide the balance by `10^{contract_decimals}`. */
    contract_decimals: number;
    /** * The string returned by the `name()` method. */
    contract_name: string;
    /** * The ticker symbol for this contract. This field is set by a developer and non-unique across a network. */
    contract_ticker_symbol: string;
    /** * Use the relevant `contract_address` to lookup prices, logos, token transfers, etc. */
    contract_address: string;
    /** * A list of supported standard ERC interfaces, eg: `ERC20` and `ERC721`. */
    supports_erc: string;
    /** * The contract logo URL. */
    logo_url: string;
    constructor(data: ContractMetadata);
}
export declare class DexReport {
    log_offset: number;
    /** * Stores the name of the protocol that facilitated the event. */
    protocol_name: string;
    /** * Stores the contract address of the protocol that facilitated the event. */
    protocol_address: string;
    /** * Stores the URL of the logo for the protocol that facilitated the event. */
    protocol_logo_url: string;
    /** * Stores the aggregator responsible for the event. */
    aggregator_name: string;
    /** * Stores the contract address of the aggregator responsible for the event. */
    aggregator_address: string;
    /** * DEXs often have multiple version - e.g Uniswap V1, V2 and V3. The `version` field allows you to look at a specific version of the DEX. */
    version: number;
    /** * Similarly to the `version` field, `fork_version` gives you the version of the forked DEX. For example, most DEXs are a fork of Uniswap V2; therefore, `fork` = `aave` & `fork_version` = `2` */
    fork_version: number;
    /** * Many DEXs are a fork of an already established DEX. The fork field allows you to see which DEX has been forked. */
    fork: string;
    /** * Stores the event taking place - e.g `swap`, `add_liquidity` and `remove_liquidity`. */
    event: string;
    /** * Stores the address of the pair that the user interacts with. */
    pair_address: string;
    pair_lp_fee_bps: number;
    lp_token_address: string;
    lp_token_ticker: string;
    lp_token_num_decimals: number;
    lp_token_name: string;
    lp_token_value: number;
    exchange_rate_usd: number;
    /** * Stores the address of token 0 in the specific pair. */
    token_0_address: string;
    /** * Stores the ticker symbol of token 0 in the specific pair. */
    token_0_ticker: string;
    /** * Stores the number of contract decimals of token 0 in the specific pair. */
    token_0_num_decimals: number;
    /** * Stores the contract name of token 0 in the specific pair. */
    token_0_name: string;
    /** * Stores the address of token 1 in the specific pair. */
    token_1_address: string;
    /** * Stores the ticker symbol of token 1 in the specific pair. */
    token_1_ticker: string;
    /** * Stores the number of contract decimals of token 1 in the specific pair. */
    token_1_num_decimals: number;
    /** * Stores the contract name of token 1 in the specific pair. */
    token_1_name: string;
    /** * Stores the amount of token 0 used in the transaction. For example, 1 ETH, 100 USDC, 30 UNI, etc. */
    token_0_amount: number;
    token_0_quote_rate: number;
    token_0_usd_quote: number;
    pretty_token_0_usd_quote: string;
    token_0_logo_url: string;
    /** * Stores the amount of token 1 used in the transaction. For example, 1 ETH, 100 USDC, 30 UNI, etc. */
    token_1_amount: number;
    token_1_quote_rate: number;
    token_1_usd_quote: number;
    pretty_token_1_usd_quote: string;
    token_1_logo_url: string;
    /** * Stores the wallet address that initiated the transaction (i.e the wallet paying the gas fee). */
    sender: string;
    /** * Stores the recipient of the transaction - recipients can be other wallets or smart contracts. For example, if you want to Swap tokens on Uniswap, the Uniswap router would typically be the recipient of the transaction. */
    recipient: string;
    constructor(data: DexReport);
}
export declare class NftSalesReport {
    log_offset: number;
    /** * Stores the topic event hash. All events have a unique topic event hash. */
    topic0: string;
    /** * Stores the contract address of the protocol that facilitated the event. */
    protocol_contract_address: string;
    /** * Stores the name of the protocol that facilitated the event. */
    protocol_name: string;
    /** * Stores the URL of the logo for the protocol that facilitated the event. */
    protocol_logo_url: string;
    /** * Stores the address of the transaction recipient. */
    to: string;
    /** * Stores the address of the transaction sender. */
    from: string;
    /** * Stores the address selling the NFT. */
    maker: string;
    /** * Stores the address buying the NFT. */
    taker: string;
    /** * Stores the NFTs token ID. All NFTs have a token ID. Within a collection, these token IDs are unique. If the NFT is transferred to another owner, the token id remains the same, as this number is its identifier within a collection. For example, if a collection has 10K NFTs then an NFT in that collection can have a token ID from 1-10K. */
    token_id: number;
    /** * Stores the address of the collection. For example, [Bored Ape Yacht Club](https://etherscan.io/token/0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d) */
    collection_address: string;
    /** * Stores the name of the collection. */
    collection_name: string;
    /** * Stores the address of the token used to purchase the NFT. */
    token_address: string;
    /** * Stores the name of the token used to purchase the NFT. */
    token_name: string;
    /** * Stores the ticker symbol of the token used to purchase the NFT. */
    ticker_symbol: string;
    /** * Stores the number decimal of the token used to purchase the NFT. */
    num_decimals: number;
    contract_quote_rate: number;
    /** * The token amount used to purchase the NFT. For example, if the user purchased an NFT for 1 ETH. The `nft_token_price` field will hold `1`. */
    nft_token_price: number;
    /** * The USD amount used to purchase the NFT. */
    nft_token_price_usd: number;
    pretty_nft_token_price_usd: string;
    /** * The price of the NFT denominated in the chains native token. Even if a seller sells their NFT for DAI or MANA, this field denominates the price in the native token (e.g. ETH, AVAX, FTM, etc.) */
    nft_token_price_native: number;
    pretty_nft_token_price_native: string;
    /** * Stores the number of NFTs involved in the sale. It's quick routine to see multiple NFTs involved in a single sale. */
    token_count: number;
    num_token_ids_sold_per_sale: number;
    num_token_ids_sold_per_tx: number;
    num_collections_sold_per_sale: number;
    num_collections_sold_per_tx: number;
    trade_type: string;
    trade_group_type: string;
    constructor(data: NftSalesReport);
}
export declare class LendingReport {
    log_offset: number;
    /** * Stores the name of the lending protocol that facilitated the event. */
    protocol_name: string;
    /** * Stores the contract address of the lending protocol that facilitated the event. */
    protocol_address: string;
    /** * Stores the logo URL of the lending protocol that facilitated the event. */
    protocol_logo_url: string;
    /** * Lending protocols often have multiple version (e.g. Aave V1, V2 and V3). The `version` field allows you to look at a specific version of the Lending protocol. */
    version: string;
    /** * Many lending protocols are a fork of an already established protocol. The fork column allows you to see which lending protocol has been forked. */
    fork: string;
    /** * Similarly to the `version` column, `fork_version` gives you the version of the forked lending protocol. For example, most lending protocols in the space are a fork of Aave V2; therefore, `fork` = `aave` & `fork_version` = `2` */
    fork_version: string;
    /** * Stores the event taking place - e.g `borrow`, `deposit`, `liquidation`, 'repay' and 'withdraw'. */
    event: string;
    /** * Stores the name of the LP token issued by the lending protocol. LP tokens can be debt or interest bearing tokens. */
    lp_token_name: string;
    /** * Stores the number decimal of the LP token. */
    lp_decimals: number;
    /** * Stores the ticker symbol of the LP token. */
    lp_ticker_symbol: string;
    /** * Stores the token address of the LP token. */
    lp_token_address: string;
    /** * Stores the amount of LP token used in the event (e.g. 1 aETH, 100 cUSDC, etc). */
    lp_token_amount: number;
    /** * Stores the total USD amount of all the LP Token used in the event. */
    lp_token_price: number;
    /** * Stores the exchange rate between the LP and underlying token. */
    exchange_rate: number;
    /** * Stores the USD price of the LP Token used in the event. */
    exchange_rate_usd: number;
    /** * Stores the name of the token going into the lending protocol (e.g the token getting deposited). */
    token_name_in: string;
    /** * Stores the number decimal of the token going into the lending protocol. */
    token_decimal_in: number;
    /** * Stores the address of the token going into the lending protocol. */
    token_address_in: string;
    /** * Stores the ticker symbol of the token going into the lending protocol. */
    token_ticker_in: string;
    /** * Stores the logo URL of the token going into the lending protocol. */
    token_logo_in: string;
    /** * Stores the amount of tokens going into the lending protocol (e.g 1 ETH, 100 USDC, etc). */
    token_amount_in: number;
    /** * Stores the total USD amount of all tokens going into the lending protocol. */
    amount_in_usd: number;
    pretty_amount_in_usd: string;
    /** * Stores the name of the token going out of the lending protocol (e.g the token getting deposited). */
    token_name_out: string;
    /** * Stores the number decimal of the token going out of the lending protocol. */
    token_decimals_out: number;
    /** * Stores the address of the token going out of the lending protocol. */
    token_address_out: string;
    /** * Stores the ticker symbol of the token going out of the lending protocol. */
    token_ticker_out: string;
    /** * Stores the logo URL of the token going out of the lending protocol. */
    token_logo_out: string;
    /** * Stores the amount of tokens going out of the lending protocol (e.g 1 ETH, 100 USDC, etc). */
    token_amount_out: number;
    /** * Stores the total USD amount of all tokens going out of the lending protocol. */
    amount_out_usd: number;
    pretty_amount_out_usd: string;
    /** * Stores the type of loan the user is taking out. Lending protocols enable you to take out a stable or variable loan. Only relevant to borrow events. */
    borrow_rate_mode: number;
    /** * Stores the interest rate of the loan. Only relevant to borrow events. */
    borrow_rate: number;
    on_behalf_of: string;
    /** * Stores the wallet address liquidating the loan. Only relevant to liquidation events. */
    liquidator: string;
    /** * Stores the wallet address of the user initiating the event. */
    user: string;
    constructor(data: LendingReport);
}
export declare class LogEvent {
    /** * The block signed timestamp in UTC. */
    block_signed_at: Date;
    /** * The height of the block. */
    block_height: number;
    /** * The offset is the position of the tx in the block. */
    tx_offset: number;
    log_offset: number;
    /** * The requested transaction hash. */
    tx_hash: string;
    raw_log_topics: string;
    /** * Use contract decimals to format the token balance for display purposes - divide the balance by `10^{contract_decimals}`. */
    sender_contract_decimals: number;
    sender_name: string;
    sender_contract_ticker_symbol: string;
    sender_address: string;
    sender_address_label: string;
    /** * The contract logo URL. */
    sender_logo_url: string;
    raw_log_data: string;
    decoded: DecodedItem;
    constructor(data: LogEvent);
}
export declare class DecodedItem {
    name: string;
    signature: string;
    params: Param[];
    constructor(data: DecodedItem);
}
export declare class Param {
    name: string;
    type: string;
    indexed: boolean;
    decoded: boolean;
    value: string;
    constructor(data: Param);
}
export declare class TransactionsBlockResponse {
    /** * The timestamp when the response was generated. Useful to show data staleness to users. */
    updated_at: Date;
    /** * The requested chain ID eg: `1`. */
    chain_id: number;
    /** * The requested chain name eg: `eth-mainnet`. */
    chain_name: string;
    /** * List of response items. */
    items: Transaction[];
    constructor(data: TransactionsBlockResponse);
}
export declare class TransactionsSummaryResponse {
    /** * The timestamp when the response was generated. Useful to show data staleness to users. */
    updated_at: Date;
    /** * The requested address. */
    address: string;
    /** * The requested chain ID eg: `1`. */
    chain_id: number;
    /** * The requested chain name eg: `eth-mainnet`. */
    chain_name: string;
    /** * List of response items. */
    items: TransactionsSummary[];
    constructor(data: TransactionsSummaryResponse);
}
export declare class TransactionsSummary {
    /** * The total number of transactions. */
    total_count: number;
    /** * The earliest transaction detected. */
    earliest_transaction: TransactionSummary;
    /** * The latest transaction detected. */
    latest_transaction: TransactionSummary;
    constructor(data: TransactionsSummary);
}
export declare class TransactionSummary {
    /** * The block signed timestamp in UTC. */
    block_signed_at: Date;
    /** * The requested transaction hash. */
    tx_hash: string;
    /** * The link to the transaction details using the Covalent API. */
    tx_detail_link: string;
    constructor(data: TransactionSummary);
}