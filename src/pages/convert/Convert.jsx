import React from "react";
import Faqs from "../../components/Faqs";
import Layout from "../../components/Layout";
import PageHeader from "../../components/PageHeader";
import ConvertSection from "./components/ConvertSection";
import StockLock from "./components/StockLock";

const Convert = () => {
	return (
		<Layout>
			<PageHeader
				title="Convert"
				subtitle="Dual Stake for Boosted yield"
				text="Experience the versatility of asset conversion with our user-friendly Convert Page, empowering you to navigate the decentralized finance landscape with ease."
				miniFav="/img/mini-fav.png"
			/>
			<ConvertSection />

			<Faqs />
		</Layout>
	);
};

export default Convert;
