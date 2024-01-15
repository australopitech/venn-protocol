import Contact from "./contact";
import WagmiProvider from "../wagmi";
import { VennAccountProvider } from "../venn-provider";

export default function Page () {
  return (
    <VennAccountProvider>
      <WagmiProvider>
          <Contact />
      </WagmiProvider>
    </VennAccountProvider>
  )
}