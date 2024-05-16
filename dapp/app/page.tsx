import { Metadata } from "next";
import LandingPageLayout from "@/components/landing-page/landing-page-layout/landing-page-layout";

export const metadata: Metadata = {
    title: "Venn Protocol",
    description: "A Brand new NFT Rental Market: No collateral needed, No Integeration required."
}

export default function Page () {
    return (
      <LandingPageLayout />
    )
}