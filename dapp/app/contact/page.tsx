import Contact from "./contact";
import WagmiProvider from "../wagmi";
import { VennAccountProvider } from "../venn-provider";

export default function Page () {
  return (
    <WagmiProvider>
      <VennAccountProvider>
          <Contact />
    </VennAccountProvider>
    </WagmiProvider>
  )
}