import AddressPage from "./dashboard";
import WagmiProvider from "@/app/wagmi";

export default function Page () {
  return (
    <WagmiProvider>
        <AddressPage />
    </WagmiProvider>
  )
}