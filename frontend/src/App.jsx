import React from "react";
import { WagmiConfig, createClient, configureChains } from "wagmi";
import { sepolia } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import Voting from "./components/Voting";

const { chains, provider, webSocketProvider } = configureChains(
  [sepolia],
  [publicProvider()]
);

const client = createClient({
  autoConnect: true,
  provider,
  webSocketProvider,
});

function App() {
  return (
    <WagmiConfig client={client}>
      <div>
        <Voting />
      </div>
    </WagmiConfig>
  );
}

export default App;
