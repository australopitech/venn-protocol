import Contact from "./contact";
import WagmiProvider from "../wagmi";

export default function Page () {
  return (
    <WagmiProvider>
        <Contact />
    </WagmiProvider>
  )
}