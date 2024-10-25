import React from "react";
import Faqs from "../../components/Faqs";
import Layout from "../../components/Layout";
import PageHeader2 from "../../components/PageHeader2";
import CapitalFarmSection from "./components/CapitalFarmSection";

const CapitalFarms = () => {
  return (
    <>
      <Layout>
        <PageHeader2
          title="Capital Farms"
          subtitle="Stake LP Tokens and earn yield in PCAP"
          text="Explore Capital Farms, where you can earn attractive yields by depositing LP tokens from various pairs on PulseX. It's your gateway to easy and profitable yield farming in DeFi."
          miniFav="/img/page-header-fav.png"
        />
        <CapitalFarmSection />
        <Faqs />
      </Layout>
    </>
  );
};

export default CapitalFarms;
