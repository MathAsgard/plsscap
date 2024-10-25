import React from "react";
import { Link } from "react-router-dom";
import Zapper from "../../../components/Zapper";

function toLocaleString(num, min, max, cutout) {
	const _number = isNaN(Number(num)) ? 0 : Number(num)
	if(cutout && num > 0 && num < cutout) return _number.toLocaleString(undefined, {minimumFractionDigits: max, maximumFractionDigits: max});
	else return _number.toLocaleString(undefined, {minimumFractionDigits: min, maximumFractionDigits: min});
  }
  
  function milStr(num) {
	  if (num > 1000000000)
		  return toLocaleString(num / 1000000000, 4, 4) + 'Bi';
	  else if (num > 1000000)
		  return toLocaleString(num / 1000000, 4, 4) + 'Mi';
	  else if (num > 1000)
		  return toLocaleString(num / 1000, 3, 3) + 'K';
	  else 
		  return toLocaleString(num, 2, 2)
  }

const AssetsAndWallets = ({...args}) => {
	const [zappedModalOpenFromHeader, setZappedModalOpenFromHeader] = React.useState(false);
	return (
		<section className="relative z-[999]">
			<div className="container xl:max-w-[1300px] relative z-10">
				<div className="flex flex-wrap gap-y-5 items-end">
					<h5 className="text-2xl sm:text-[40px] font-medium flex items-center gap-5 flex-grow mb-1">
						<div>My Assets & Wallet</div>
						<span className="w-0 flex-grow bg-gradient8 h-[2px]"></span>
					</h5>
					<div className="w-full md:w-auto text-right md:min-w-[235px] flex flex-wrap-reverse justify-between items-center gap-2 md:flex-col md:items-end md:justify-end">
						<div>
							<div>
								Need <span className="text-gradient-3">PCAP</span> or{" "}
								<span className="text-gradient-3">STOCK</span> Tokens?
							</div>
						</div>
						<button
							className="btn-2 md:w-full md:max-w-[235px] ml-auto"
							onClick={()=>setZappedModalOpenFromHeader(true)}
						>
							BUY / ZAP
						</button>
					</div>
				</div>
				<div className="grid lg:grid-cols-2 gap-5 mt-4">
					<div>
						<div className="grid grid-cols-1 gap-5">
							<div className="asset-card h-full">
								<div className="inner">
									<div
										className="py-6 md:py-8"
										style={{
											background: `url('/img/asset-card-shape.png') no-repeat top right / cover`,
										}}
									>
										<h5 className="text-md sm:text-lg font-semibold flex items-center gap-5 flex-grow mb-4 px-4 xl:pl-[39px] pr-0">
											<div>My Rewards</div>
											<span className="w-0 flex-grow bg-gradient8 h-[1px]"></span>
										</h5>
										<div className="grid sm:grid-cols-3 gap-5 xl:gap-10 px-4 xl:px-[39px]">
											<div className="">
												<div className="text-white text-opacity-50 mb-[5px] text-center">
													Capital Farms
												</div>
												<div className="asset-card mb-[14px]">
													<div className="rounded-[10px] bg-[#140236] text-center h-full">
														<div className="pt-[14px] pb-2 font-semibold px-3 leading-[19px]">
															{args.farmsData["farms"] && args.farmsData["farms"]["rewards"] ? milStr(args.farmsData["farms"]["rewards"]) : "0.00"}
														</div>
														<div className="text-sm text-white text-opacity-30 border-t border-white border-opacity-20 py-1 px-3">
															${args.farmsData["farms"] && args.farmsData["farms"]["rewardsUSD"] ? milStr(args.farmsData["farms"]["rewardsUSD"]) : "0.00"}
														</div>
													</div>
												</div>
												<button
													type="button"
													className="btn-3 w-full"
													onClick={()=>window.location="/capital-farms"}
												>
													Harvest Farms
												</button>
											</div>
											<div className="">
												<div className="text-white text-opacity-50 mb-[5px] text-center">
													Heart Fund
												</div>
												<div className="asset-card mb-[14px]">
													<div className="rounded-[10px] bg-[#140236] text-center h-full">
														<div className="pt-[14px] pb-2 font-semibold px-3 leading-[19px]">
															{args.farmsData["rhFarms"] && args.farmsData["rhFarms"]["rewards"] ? milStr(args.farmsData["rhFarms"]["rewards"]) : "0.00"}
														</div>
														<div className="text-sm text-white text-opacity-30 border-t border-white border-opacity-20 py-1 px-3">
															${args.farmsData["rhFarms"] && args.farmsData["rhFarms"]["rewardsUSD"] ? milStr(args.farmsData["rhFarms"]["rewardsUSD"]) : "0.00"}
														</div>
													</div>
												</div>
												<button
													type="button"
													className="btn-3 w-full"
													onClick={()=>window.location="/heart-fund"}
												>
													Harvest Pools
												</button>
											</div>
											<div className="">
												<div className="text-white text-opacity-50 mb-[5px] text-center">
													STOCk Vault
												</div>
												<div className="asset-card mb-[14px]">
													<div className="rounded-[10px] bg-[#140236] text-center h-full">
														<div className="pt-[14px] pb-2 font-semibold px-3 leading-[19px]">
															{milStr(args.stockStaked)}
														</div>
														<div className="text-sm text-white text-opacity-30 border-t border-white border-opacity-20 py-1 px-3">
															${milStr(args.stockStakedUSD)}
														</div>
													</div>
												</div>
												<button
													type="button"
													className="btn-3 w-full"
													onClick={()=>window.location="/stock-vault"}
												>
													Harvest Market
												</button>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div className="asset-card h-full">
								<div className="inner">
									<div
										className="pt-4 pb-[22px]"
										style={{
											background: `url('/img/asset-card-shape.png') no-repeat top right / cover`,
										}}
									>
										<h5 className="text-md sm:text-lg font-semibold flex items-center gap-5 flex-grow mb-4 px-4 xl:pl-[39px] pr-0">
											<div>My Wallet</div>
											<span className="w-0 flex-grow bg-gradient8 h-[1px]"></span>
										</h5>
										<div className="grid sm:grid-cols-3 gap-5 xl:gap-10 px-4 xl:px-[39px]">
											<div className="">
												<div className="text-white text-opacity-50 mb-[5px] text-center">
													PCAP
												</div>
												<div className="asset-card">
													<div className="rounded-[10px] bg-[#140236] text-center h-full">
														<div className="pt-[14px] pb-2 font-semibold px-3 leading-[19px]">
															{args.pcapBalance}
														</div>
														<div className="text-sm text-white text-opacity-30 border-t border-white border-opacity-20 py-1 px-3">
															${args.pcapBalanceUSD}
														</div>
													</div>
												</div>
											</div>
											<div className="">
												<div className="text-white text-opacity-50 mb-[5px] text-center">
													STOCK
												</div>
												<div className="asset-card">
													<div className="rounded-[10px] bg-[#140236] text-center h-full">
														<div className="pt-[14px] pb-2 font-semibold px-3 leading-[19px]">
															{args.stockBalance}
														</div>
														<div className="text-sm text-white text-opacity-30 border-t border-white border-opacity-20 py-1 px-3">
															${args.stockBalanceUSD}
														</div>
													</div>
												</div>
											</div>
											<div className="">
												<div className="text-white text-opacity-50 mb-[5px] text-center">
													PLS
												</div>
												<div className="asset-card">
													<div className="rounded-[10px] bg-[#140236] text-center h-full">
														<div className="pt-[14px] pb-2 font-semibold px-3 leading-[19px]">
															{args.plsBalance}
														</div>
														<div className="text-sm text-white text-opacity-30 border-t border-white border-opacity-20 py-1 px-3">
															${args.plsBalanceUSD}
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="asset-card h-full">
						<div className="inner">
							<div
								className="py-6 md:py-8 h-full"
								style={{
									background: `url('/img/asset-card-shape.png') no-repeat top right / cover`,
								}}
							>
								<h5 className="text-md sm:text-lg font-semibold flex items-center gap-5 flex-grow mb-6 md:mb-10 px-4 xl:pl-[39px] pr-0">
									<div>My Portfolio</div>
									<span className="w-0 flex-grow bg-gradient8 h-[1px]"></span>
								</h5>
								<div className="flex flex-wrap px-4 xl:px-[39px] gap-5 md:gap-7">
									<div className="asset-card w-full">
										<div className="rounded-[10px] bg-[#140236] text-center h-full">
											<div className="pt-4 pb-2 text-md sm:text-xl font-semibold px-3">
												${args.farmsData["farms"] && args.farmsData["farms"]["stakedUSD"] ? 
												milStr(args.farmsData["farms"]["stakedUSD"] + args.farmsData["rhFarms"]["stakedUSD"] + args.stockStakedUSD + args.stockLockUSD)
												: "0.00"}
											</div>
											<div className="text-sm sm:text-normal text-white text-opacity-30 border-t border-white border-opacity-20 py-1 px-3">
												My Total Assets Staked
											</div>
										</div>
									</div>
									<div className="asset-card w-full sm:w-[calc(50%-10px)] md:w-[calc(50%-14px)]">
										<div className="rounded-[10px] bg-[#140236] text-center h-full">
											<div className="pt-4 pb-2 text-md sm:text-lg font-semibold px-3">
												${args.farmsData["farms"] && args.farmsData["farms"]["stakedUSD"] ? milStr(args.farmsData["farms"]["stakedUSD"]) : "0.00"}
											</div>
											<div className="text-sm sm:text-normal text-white text-opacity-30 border-t border-white border-opacity-20 py-1 px-3">
												My Total Assets in Capital Farms
											</div>
										</div>
									</div>
									<div className="asset-card w-full sm:w-[calc(50%-10px)] md:w-[calc(50%-14px)]">
										<div className="rounded-[10px] bg-[#140236] text-center h-full">
											<div className="pt-4 pb-2 text-md sm:text-lg font-semibold px-3">
												${args.farmsData["rhFarms"] && args.farmsData["rhFarms"]["stakedUSD"] ? milStr(args.farmsData["rhFarms"]["stakedUSD"]) : "0.00"}
											</div>
											<div className="text-sm sm:text-normal text-white text-opacity-30 border-t border-white border-opacity-20 py-1 px-3">
												Total Assets in Heart Fund
											</div>
										</div>
									</div>
									<div className="asset-card w-full sm:w-[calc(50%-10px)] md:w-[calc(50%-14px)]">
										<div className="rounded-[10px] bg-[#140236] text-center h-full">
											<div className="pt-4 pb-2 text-md sm:text-lg font-semibold px-3">
												${milStr(args.stockStakedUSD)}
											</div>
											<div className="text-sm sm:text-normal text-white text-opacity-30 border-t border-white border-opacity-20 py-1 px-3">
												Total Assets in STOCK Vault
											</div>
										</div>
									</div>
									<div className="asset-card w-full sm:w-[calc(50%-10px)] md:w-[calc(50%-14px)]">
										<div className="rounded-[10px] bg-[#140236] text-center h-full">
											<div className="pt-4 pb-2 text-md sm:text-lg font-semibold px-3">
												${milStr(args.stockLockUSD)}
											</div>
											<div className="text-sm sm:text-normal text-white text-opacity-30 border-t border-white border-opacity-20 py-1 px-3">
												STOCK Lock
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<Zapper
				zappedModalOpenFromHeader={zappedModalOpenFromHeader}
				setZappedModalOpenFromHeader={setZappedModalOpenFromHeader}
			/>
		</section>
	);
};

export default AssetsAndWallets;
