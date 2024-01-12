import About from "./about";
import WagmiProvider from "../wagmi";

export default function Page () {
  return (
    <WagmiProvider>
        <About />
    </WagmiProvider>
  )
}