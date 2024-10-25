import { useEffect } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import "swiper/css";
import CapitalFarms from "./pages/capital-farms/CapitalFarms";
import Convert from "./pages/convert/Convert";
import Dashboard from "./pages/dashboard/Dashboard";
import HeartFund from "./pages/heart-fund/HeartFund";
import Home from "./pages/home/Home";
import Presale from "./pages/presale/Presale";
import StockVault from "./pages/stock-vault/StockVault";

import { Toaster } from "react-hot-toast";

import {
  WagmiConfig,
  createConfig,
  configureChains,
  useSwitchNetwork,
} from "wagmi";
import { publicProvider } from "wagmi/providers/public";

import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet";
import { InjectedConnector } from "wagmi/connectors/injected";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { pulsechain } from "wagmi/chains";

// 1. Get projectId
const projectId = "b7099df79b91d3aa8f5ea58707f84443";

// 2. Create wagmiConfig
const metadata = {
  name: "Warren.Finance",
  description: "Warren Finance",
  url: "https://warren-app.netlify.app/", //change
};

// Configure chains & providers with the Alchemy provider.
// Two popular providers are Alchemy (alchemy.com) and Infura (infura.io)
const { chains, publicClient, webSocketPublicClient } = configureChains(
  [pulsechain],
  [publicProvider()]
);

// Set up wagmi config
const config = createConfig({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({ chains }),
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: "wagmi",
      },
    }),
    new WalletConnectConnector({
      chains,
      options: {
        projectId,
      },
    }),
    new InjectedConnector({
      chains,
      options: {
        name: "Injected",
        shimDisconnect: true,
      },
    }),
  ],
  publicClient,
  webSocketPublicClient,
});

function App() {
  const Wrapper = ({ children }) => {
    const location = useLocation();
    useEffect(() => {
      setTimeout(() => {
        document.documentElement.scrollTo(0, 0);
      }, 0);
    }, [location.pathname, location.search]);
    return children;
  };
  return (
    <WagmiConfig config={config}>
      <BrowserRouter>
        <Wrapper>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/heart-fund" element={<HeartFund />} />
            <Route path="/capital-farms" element={<CapitalFarms />} />
            <Route path="/stock-vault" element={<StockVault />} />

            <Route path="/presale" element={<Presale />} />
            <Route path="/convert" element={<Convert />} />
          </Routes>
        </Wrapper>
        <Toaster position="top-center" reverseOrder={false} />
      </BrowserRouter>
    </WagmiConfig>
  );
}

export default App;
