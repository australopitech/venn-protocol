
export type nftViewMode = "owned" | "rented";

export interface nftViewContext {
  mode : nftViewMode;
  setNftsViewMode: React.Dispatch<React.SetStateAction<nftViewMode>>;
}

export type TimeUnitType = 'day' | 'hour' | 'minute';