import React, {useState, useEffect} from "react";
import ScrollAnimation from "react-animate-on-scroll";
import BigNumber from 'bignumber.js/bignumber'
import useInterval from "../../../hooks/useInterval";
import contracts from "../../../config/constants/contracts.js"
import { multicall } from '@wagmi/core'



function toLocaleString(num, min, max, cutout) {
	const _number = isNaN(Number(num)) ? 0 : Number(num)
	if(cutout && num > 0 && num < cutout) return _number.toLocaleString(undefined, {minimumFractionDigits: max, maximumFractionDigits: max});
	else return _number.toLocaleString(undefined, {minimumFractionDigits: min, maximumFractionDigits: min});
}
function milStr(num) {
    if (num > 1000000000)
        return toLocaleString(num / 1000000000, 2, 2) + 'Bi';
    else if (num > 1000000)
        return toLocaleString(num / 1000000, 2, 2) + 'Mi';
    else if (num > 1000)
        return toLocaleString(num / 1000, 2, 2) + 'K';
	else 
		return toLocaleString(num, 2, 2)
}
const Counter = () => {

	const [counters, setCounters] = React.useState([]);
	async function getStats() {

		const query = '0x554dcc3dFD807ef343855837A404bF4dF6D8C7Ee' 
		const response = await fetch(`https://api.dexscreener.com/latest/dex/pairs/pulsechain/${query}`);
		const rsps = await response.json();
		
		const pinePrice = rsps.pairs.filter((pair)=>pair.pairAddress === '0x554dcc3dFD807ef343855837A404bF4dF6D8C7Ee')[0].priceUsd

		const [totalSupply, pcapPerBlock] = await multicall({
			contracts: [
				{
					...contracts.pcapToken,
					functionName: 'totalSupply'
				},
				{
					...contracts.masterChef,
					functionName: 'PcapPerBlock'
				},
			]
		});
		console.log(totalSupply.result, 'wawa supply')
		setCounters(
			
		[
			{
				count: `$${milStr(Number(totalSupply.result)/1e18*pinePrice)}`,
				text: "Market Cap",
			},
			{
				count: `${milStr(Number(totalSupply.result)/1e18)}`,
				text: "Circulating Supply",
			},
			{
				count: `${milStr(Number(totalSupply.result)/1e18 - 100000)}`,
				text: "Total PCAP Minted",
			},
			{
				count: `${toLocaleString(Number(pcapPerBlock.result)/1e18, 0, 0)}`,
				text: "PCAP Minted per Block",
			},
		])
			
		
	}
	useEffect(() => {
		getStats();
	},[]);
	useInterval(async () => {
		await getStats();
	}, 15000);
	return (
		<section className="mt-[-70px] relative z-10">
			<div className="container xl:max-w-[1263px]">
				<ScrollAnimation animateIn="fadeInUp" animateOnce={true}>
					<div className="bg-gradient3 p-[1px] rounded-[20px]">
						<div className="bg-gradient2 rounded-[20px] border-t border-[#130833]">
							<div
								className="p-8 rounded-[20px]"
								style={{
									background: `url('/img/counter-bg.png') no-repeat center center / cover`,
								}}
							>
								<div className="flex flex-wrap justify-evenly gap-y-8">
									{counters.map((counter, index) => (
										<div
											key={index}
											className="w-full md:w-[calc(50%-20px)] lg:w-[calc(25%-20px)]"
										>
											<div className="text-center">
												<h3 className="text-xl md:text-2xl font-black mb-2 md:mb-4">
													{counter.count}
												</h3>
												<p className="text-white font-semibold md:text-md text-gradient-3">
													{counter.text}
												</p>
											</div>
										</div>
									))}
								</div>
							</div>
						</div>
					</div>
				</ScrollAnimation>
			</div>
		</section>
	);
};

export default Counter;
