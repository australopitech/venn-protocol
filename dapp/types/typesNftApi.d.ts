export declare class BalancesResponse {
    /** * The requested address. */
    address: string;
    /** * The requested chain ID eg: `1`. */
    chain_id: number;
    /** * The requested chain name eg: `eth-mainnet`. */
    chain_name: string;
    /** * The requested quote currency eg: `USD`. */
    quote_currency: string;
    /** * The timestamp when the response was generated. Useful to show data staleness to users. */
    updated_at: Date;
    /** * List of response items. */
    items: BalanceItem[];
    constructor(data: BalancesResponse);
}
export declare class BalanceItem {
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
    /** * The timestamp when the token was transferred. */
    last_transferred_at: Date;
    /** * Indicates if a token is the chain's native gas token, eg: ETH on Ethereum. */
    native_token: boolean;
    /** * One of `cryptocurrency`, `stablecoin`, `nft` or `dust`. */
    type: string;
    /** * Denotes whether the token is suspected spam. */
    is_spam: boolean;
    /** * The asset balance. Use `contract_decimals` to scale this balance for display purposes. */
    balance: string | null;
    /** * The exchange rate for the requested quote currency. */
    quote_rate: number;
    /** * The current balance converted to fiat in `quote-currency`. */
    quote: number;
    /** * A prettier version of the quote for rendering purposes. */
    pretty_quote: string;
    /** * NFT-specific data. */
    nft_data: NftData[];
    constructor(data: BalanceItem);
}
export declare class NftData {
    /** * The token's id. */
    token_id: string | null;
    token_url: string;
    /** * The original minter. */
    original_owner: string;
    external_data: NftExternalData;
    /** * If `true`, the asset data is available from the Covalent CDN. */
    asset_cached: boolean;
    /** * If `true`, the image data is available from the Covalent CDN. */
    image_cached: boolean;
    constructor(data: NftData);
}
export declare class NftExternalData {
    name: string;
    description: string;
    asset_url: string;
    asset_file_extension: string;
    asset_mime_type: string;
    asset_size_bytes: string;
    image: string;
    image_256: string;
    image_512: string;
    image_1024: string;
    animation_url: string;
    external_url: string;
    attributes: NftCollectionAttribute[];
    constructor(data: NftExternalData);
}
export declare class NftCollectionAttribute {
    trait_type: string;
    value: string;
    constructor(data: NftCollectionAttribute);
}
export class NftItem {
    nftData: NftData; 
    contractAddress: string;
    owner: string | undefined;
    isRental: boolean | undefined;
}
export class FetchNftDataResponse {
    nfts: NftItem[] | null;
    error: string | null;
    isLoading: boolean;
}