import React, { useState, useEffect } from "react";
import Faqs from "../../components/Faqs";
import Layout from "../../components/Layout";
import PageHeader2 from "../../components/PageHeader2";
import HeartFundSection from "./components/HeartFundSection";

const HeartFund = () => {
  return (
    <>
      <Layout>
        <PageHeader2
          title="Heart Fund"
          subtitle="Dual Stake for Boosted yield"
          text="Unlock boosted rewards with Heart Fund, by staking LP and STOCK tokens, you can supercharge your returns and grow your investment portfolio in DeFi."
          miniFav="/img/page-header-fav.png"
        />
        <HeartFundSection />
        <Faqs />
      </Layout>
    </>
  );
};

export default HeartFund;
