import React from "react";
import Faqs from "../../components/Faqs";
import Layout from "../../components/Layout";
import PageHeader from "../../components/PageHeader";
import MyVault from "./components/MyVault";
import StockVaultSection from "./components/StockVaultSection";

const StockVault = () => {
  return (
    <>
      <Layout>
        <PageHeader
          title="STOCK Vault"
          subtitle="Stake STOCK and earn yield in LP"
          text="Stake your STOCK tokens and watch your investment flourish while earning rewards. It's your opportunity to grow with Pulse Capital."
          miniFav="/img/mini-fav.png"
        />
        <StockVaultSection />
        <Faqs />
      </Layout>
    </>
  );
};

export default StockVault;
