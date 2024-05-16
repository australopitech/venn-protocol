import Market from "./market-place";
import WagmiProvider from "../wagmi";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Venn Market Place",
  description: "Rent NFTs with a few simple clicks"
}

export default function Page() {
  return <Market />
}