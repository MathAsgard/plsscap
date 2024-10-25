import React from "react";
import Layout from "../../components/Layout";
import Banner from "./components/Banner";
import Counter from "./components/Counter";
import EchosystemSection from "./components/EchosystemSection";
import LatestUpdates from "./components/LatestUpdates";
import Partner from "./components/Partner";
import Rewards from "./components/Rewards";

const Home = () => {
	return (
		<Layout>
			<Banner />
			<Counter />
			<LatestUpdates />
			<EchosystemSection />
			<Rewards />
			{/* <JoinCommunity /> */}
			<Partner />
		</Layout>
	);
};

export default Home;
