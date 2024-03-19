import AddressPage from "./dashboard";
import WagmiProvider from "@/app/wagmi";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Venn Dashboard Wallet",
  description: "Safely list your NFTs for rent with ease using Venn Dashboard Wallet"
}

export default function Page () {
  return <AddressPage />
}