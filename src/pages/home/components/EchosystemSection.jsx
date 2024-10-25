import { React, useState } from "react";
import ScrollAnimation from "react-animate-on-scroll";
import { Link } from "react-router-dom";
import CountdownCard from "../../../components/CountdownCard";
import { ArrowRight } from "../../../components/Icon";
import CapitalFarmsCard from "../../capital-farms/components/CapitalFarmsCard";
import HeartFundCard from "../../heart-fund/components/HeartFundCard";
import StockVaultSection from "../../stock-vault/components/StockVaultSection";
import farms from "../../../config/constants/farms.js"
import farmsRh from "../../../config/constants/farmsRh.js"
let farmsArray = JSON.parse(JSON.stringify(farms))
let farmsFilters = {}
let farmsArrayRh = JSON.parse(JSON.stringify(farmsRh))

const EchosystemSection = () => {
	const [view, setView] = useState("list");
	const [value, setValue] = useState("");

	const [active, setActive] = useState(true);
	const [stackedOnly, setStacked] = useState(false);
	const [search, setSearch] = useState('');
	const [dropdown, setDropdown] = useState('');

	function dropDownFilter(value) {
			const _val = value.toLowerCase()
			switch (_val) {
				case '':
					farmsArray = JSON.parse(JSON.stringify(farms));
					break;
				case 'hot': 
					farmsArray = JSON.parse(JSON.stringify(farms));
					farmsArray.reverse();
					break;
				case 'apr': 
					farmsArray = JSON.parse(JSON.stringify(farms))
					farmsArray.sort(function(a, b) {
						return parseFloat(farmsFilters[b.lpAddress].farmAPR) - parseFloat(farmsFilters[a.lpAddress].farmAPR);
					});
					break;
				case 'earned': 
					farmsArray = JSON.parse(JSON.stringify(farms))
					farmsArray.sort(function(a, b) {
						return parseFloat(farmsFilters[b.lpAddress].pendingPine) - parseFloat(farmsFilters[a.lpAddress].pendingPine);
					});
					break;
				case 'liquidity': 
					farmsArray = JSON.parse(JSON.stringify(farms))
					farmsArray.sort(function(a, b) {
						return parseFloat(farmsFilters[b.lpAddress].totalLiquidity) - parseFloat(farmsFilters[a.lpAddress].totalLiquidity);
					});
					break;
			}
			setDropdown(value)
		}

		function objectToFilter(lpAddress, object) {
			farmsFilters[lpAddress] = object
		}
	return (
		<section className="relative pt-12">
			<div className="noisy-bg top-[-50px]" />
			<div className="container relative z-10 lg:max-w-[1160px]">
				<ScrollAnimation animateIn="fadeInUp" animateOnce={true}>
					<div className="pb-12 md:pb-[120px] xl:mb-[172px]">
						<h5 className="text-4xl sm:text-6xl font-semibold text-center mb-2">
							<div>
								Discover{" "}
								<span className="text-gradient-2 bg-gradient7">
									Our Ecosystem
								</span>{" "}
							</div>
						</h5>
						<div className="text-md xl:text-lg max-w-[655px] mx-auto text-center">
							Uncover the full spectrum of DeFi opportunities within our
							dynamic ecosystem, designed for sustainable growth and
							maximum returns.
						</div>
					</div>
				</ScrollAnimation>
				<ScrollAnimation animateIn="fadeInUp" animateOnce={true}>
					<div className="flex flex-wrap-reverse items-center gap-6 gap-y-9 justify-center lg:justify-between pb-10 xl:pb-[116px]">
						<div className="w-full lg:max-w-[380px] xl:max-w-[420px]">
							<h5 className="text-4xl sm:text-6xl font-semibold mb-[11.5px]">
								<div>
									<span className="text-gradient-4">
										Earn Passive Income
									</span>{" "}
									in the Capital Farms
								</div>
							</h5>
							<div className="text-md xl:text-lg mb-7">
								Explore the possibilities of generating passive income
								within Capital Farms, a premier DeFi yield farming
								platform where LP token deposits from PulseX pairs yield
								competitive returns.
							</div>
							<div className="relative inline-block">
								<Link
									to="/capital-farms"
									className="btn-3 px-8 h-10 rounded-full justify-center d-center inline-flex"
								>
									Earn Now <ArrowRight />
								</Link>
								<img
									src="/img/capital-shape.png"
									className="hidden lg:block absolute bottom-5 left-[calc(100%+60px)] xl:left-[calc(100%+24px)] w-unset lg:max-w-[calc(100vw-400px)] -z-10"
									alt=""
								/>
							</div>
						</div>
						<div className="w-full lg:max-w-[420px] xl:mr-20">
							{farmsArray.slice(0, 1).map((farm, index) => (
								<CapitalFarmsCard key={index} objectToFilter={objectToFilter} active={active} search={search} stakedOnly={stackedOnly} dropdown={dropdown} {...farm} hideButtons/>
							))}
						</div>
					</div>
				</ScrollAnimation>
				<ScrollAnimation animateIn="fadeInDown" animateOnce={true}>
					<div className="flex flex-wrap items-center gap-6 gap-y-9 justify-center lg:justify-between py-10 xl:py-[116px]">
						<div className="w-full lg:max-w-[420px] relative z-[11]">
							<div className="noisy-bg top-[-150px] xl:left-[-70px]" />
							<div className="relative z-10">
								{farmsArray.slice(0, 1).map((farm, index) => (
									<HeartFundCard key={index} objectToFilter={objectToFilter} active={active} search={search} stakedOnly={stackedOnly} dropdown={dropdown} {...farm} hideButtons/>
								))}
							</div>
						</div>
						<div className="w-full lg:max-w-[400px] xl:max-w-[500px] lg:pr-6 xl:pr-0 xl:mr-6 relative z-10">
							<div className="noisy-bg top-[-50px]" />
							<div className="relative z-10">
								<h5 className="text-4xl sm:text-6xl font-semibold mb-[11.5px]">
									<div>
										<span className="text-gradient-4">
											Enjoy Boosted Yield
										</span>{" "}
										<br className="hidden sm:inline-block" />
										Using the Heart Fund
									</div>
								</h5>
								<div className="text-md xl:text-lg mb-7">
									Harness the power of the Heart Fund to supercharge
									your yield potential, leveraging LP and STOCK token
									staking to unlock premium rewards and maximize your
									profits in the ever-evolving world of DeFi.
								</div>
								<div className="relative xl:inline-block">
									<Link
										to="/heart-fund"
										className="btn-3 px-8 h-10 rounded-full justify-center d-center inline-flex"
									>
										Boost Now <ArrowRight />
									</Link>
									<img
										src="/img/heart-fund.png"
										className="hidden lg:block absolute bottom-5 lg:right-0 xl:right-[unset] xl:left-full w-unset lg:max-w-[calc(100vw-200px)] -z-10 xl:-translate-x-1/2"
										alt=""
									/>
								</div>
							</div>
						</div>
					</div>
				</ScrollAnimation>
				<div className="relative">
					<div className="noisy-bg top-10" />
					<ScrollAnimation animateIn="fadeInDown" animateOnce={true}>
						<div className="flex flex-wrap-reverse lg:flex-nowrap items-center gap-6 gap-y-9 justify-center lg:justify-between pb-10 lg:pb-[116px] relative z-10">
							<div className="w-full lg:max-w-[420px]">
								<h5 className="text-4xl sm:text-6xl font-semibold mb-[11.5px]">
									<div>
										<span className="text-gradient-4 xl:block">
											Dive into Growth
										</span>{" "}
										with The STOCK Vault
									</div>
								</h5>
								<div className="text-md xl:text-lg mb-7">
									With customizable lock-up periods and enticing
									incentives, the STOCK Vault empowers investors to
									cultivate their portfolios and maximize their returns
									with confidence.
								</div>
								<div className="relative inline-block">
									<Link
										to="/stock-vault"
										className="btn-3 px-8 h-10 rounded-full justify-center d-center inline-flex"
									>
										Earn Now <ArrowRight />
									</Link>
									<img
										src="/img/stock-vault.png"
										className="hidden lg:block absolute bottom-5 left-[calc(100%+24px)] w-unset lg:max-w-[calc(100vw-400px)] -z-10"
										alt=""
									/>
								</div>
							</div>
							<div className="w-full lg:max-w-[475px] xl:max-w-[625px] relative z-10">
								<div className="asset-card h-full">
									<div className="inner bg-[#1C0050]">
										<img
											src="/img/asset-card-shape.png"
											className="absolute top-0 right-0 w-[75%] rounded-[10px] blur-[75px]"
											alt=""
										/>
										<div className="h-full relative z-[11]">
											<StockVaultSection homepage={true}/>
										</div>
									</div>
								</div>
							</div>
						</div>
					</ScrollAnimation>
				</div>
			</div>
		</section>
	);
};

export default EchosystemSection;
