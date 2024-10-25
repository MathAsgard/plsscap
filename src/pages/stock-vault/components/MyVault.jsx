import "@material-tailwind/react";
import React from "react";
import CountdownCard from "../../../components/CountdownCard";
import StockVaultCard from "./StockVaultCard";
const MyVault = () => {
	const [view, setView] = React.useState("list");

	const handleMobile = () => {
		if (window.innerWidth < 768) {
			setView("grid");
		}
	};
	React.useEffect(() => {
		handleMobile();
		window.addEventListener("resize", handleMobile);
		return () => window.removeEventListener("resize", handleMobile);
	}, []);
	return (
		<section className="relative z-[99]">
			<div className="noisy-bg top-[-100px]" />
			<div className="container xl:max-w-[1330px] relative z-10">
				<div className="xl:max-w-[1130px] mx-auto">
					<div className="mb-4 sm:mb-[38px]">
						<div className="flex flex-wrap gap-5">
							<h5 className="text-2xl sm:text-[40px] font-medium flex items-center gap-5 flex-grow">
								<div>My Vault</div>
								<span className="w-0 flex-grow bg-gradient8 h-[2px]"></span>
							</h5>
							<div className="rounded-full bg-tableRowBorder relative p-[1px] pb-0">
								<div className="flex flex-wrap gap-x-2 sm:gap-x-0 gap-y-2 items-center bg-[#1C0050] rounded-full relative z-10">
									<button
										type="button"
										className={`view-btn ${
											view === "list" ? "active" : ""
										}`}
										onClick={() => setView("list")}
									>
										<span>List View</span>
									</button>
									<button
										type="button"
										className={`view-btn ${
											view === "grid" ? "active" : ""
										}`}
										onClick={() => setView("grid")}
									>
										<span>Grid View</span>
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
				{view === "list" ? (
					// <div className="xl:max-w-[1130px] mx-auto">

					<div className="relative z-10 rounded-t-none rounded-b-[10px]">
						{/* <div className="gradient-border bg-tableGradient inset-[1px] top-[75px] z-10 before:h-[2px] before:w-full before:absolute before:left-0 before:top-[-1px] before:bg-tableBg" /> */}

						<div className="rounded-[10px] bg-tableBg overflow-hidden px-4 pb-4 xl:px-[43px] xl:pb-[43px] relative">
							<div
								className="absolute left-0 right-0 bottom-0 top-[75px]"
								style={{
									background: `url('/img/table-overlay.png') no-repeat right top / cover`,
								}}
							/>
							<div className="gradient-border h-full max-h-[675px] bg-gradient9" />
							<div className="overflow-x-auto">
								<table className="custom-table">
									<thead>
										<tr className="font-semibold md:text-lg">
											<th className="p-4 text-nowrap">Stake</th>
											<th className="p-4 text-nowrap">Duration</th>
											<th className="p-4 text-nowrap">Shares</th>
											<th className="p-4 text-nowrap">Rewards</th>
											<th className="p-4 text-nowrap">Days Left</th>
											<th className="p-4 text-nowrap">Action</th>
										</tr>
										<tr>
											<th className="md:p-4"></th>
										</tr>
									</thead>
									<tbody>
										{data.map((item, index) => (
											<tr className="text-center" key={index}>
												<td className="custom-table-td py-2">
													<div className="font-semibold">
														{item.stake} STOCK
													</div>
													<span className="text-gradient-3 text-sm">
														{item.stakeAmount}
													</span>
												</td>
												<td className="custom-table-td py-2">
													<div className="font-semibold text-blue uppercase">
														{item.duration}
													</div>
													<span className="text-sm text-white text-opacity-50 min:w-[155px]">
														<CountdownCard
															targetDate={item.countDown}
															shortend={true}
															showDays={true}
														/>
													</span>
												</td>
												<td className="custom-table-td py-2">
													<div className="font-semibold">
														{item.shares}
													</div>
													<span className="text-white text-opacity-50 text-sm">
														{item.shareBonus}
													</span>
												</td>
												<td className="custom-table-td py-2">
													<div className="font-semibold text-gradient-3">
														{item.rewards}
													</div>
													<div className="text-white text-opacity-50 text-sm">
														{item.rewards2}
													</div>
												</td>
												<td className="custom-table-td py-2">
													<div className="font-semibold">
														{item.daysLeft}
													</div>
													<span className="text-gradient-3 uppercase text-sm">
														{item.daysLeft2}
													</span>
												</td>
												<td className="custom-table-td py-2">
													<button
														type="button"
														className="stake-btn"
													>
														Unstake
													</button>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</div>
					</div>
				) : (
					<div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
						{data
							?.map((item, index) => (
								<div className="" key={index}>
									<StockVaultCard item={item} />
								</div>
							))
							.slice(0, 6)}
					</div>
				)}
			</div>
		</section>
	);
};
const data = [
	{
		stake: "10,000",
		stakeAmount: "$6,303.12",
		duration: "5000 Days",
		countDown: "June 30, 2024 00:00:00",
		shares: "123,485.54",
		shareBonus: "+25% Bonus",
		rewards: "1,826 LP",
		rewards2: "$1,236.44",
		daysLeft: "0 Days",
		daysLeft2: "100%",
	},
	{
		stake: "10,000",
		stakeAmount: "$6,303.12",
		duration: "5000 Days",
		countDown: "June 30, 2024 00:00:00",
		shares: "123,485.54",
		shareBonus: "+25% Bonus",
		rewards: "1,826 LP",
		rewards2: "$1,236.44",
		daysLeft: "0 Days",
		daysLeft2: "100%",
	},
	{
		stake: "10,000",
		stakeAmount: "$6,303.12",
		duration: "5000 Days",
		countDown: "June 30, 2024 00:00:00",
		shares: "123,485.54",
		shareBonus: "+25% Bonus",
		rewards: "1,826 LP",
		rewards2: "$1,236.44",
		daysLeft: "0 Days",
		daysLeft2: "100%",
	},
	{
		stake: "10,000",
		stakeAmount: "$6,303.12",
		duration: "5000 Days",
		countDown: "June 30, 2024 00:00:00",
		shares: "123,485.54",
		shareBonus: "+25% Bonus",
		rewards: "1,826 LP",
		rewards2: "$1,236.44",
		daysLeft: "0 Days",
		daysLeft2: "100%",
	},
	{
		stake: "10,000",
		stakeAmount: "$6,303.12",
		duration: "5000 Days",
		countDown: "June 30, 2024 00:00:00",
		shares: "123,485.54",
		shareBonus: "+25% Bonus",
		rewards: "1,826 LP",
		rewards2: "$1,236.44",
		daysLeft: "0 Days",
		daysLeft2: "100%",
	},
	{
		stake: "10,000",
		stakeAmount: "$6,303.12",
		duration: "5000 Days",
		countDown: "June 30, 2024 00:00:00",
		shares: "123,485.54",
		shareBonus: "+25% Bonus",
		rewards: "1,826 LP",
		rewards2: "$1,236.44",
		daysLeft: "0 Days",
		daysLeft2: "100%",
	},
	{
		stake: "10,000",
		stakeAmount: "$6,303.12",
		duration: "5000 Days",
		countDown: "June 30, 2024 00:00:00",
		shares: "123,485.54",
		shareBonus: "+25% Bonus",
		rewards: "1,826 LP",
		rewards2: "$1,236.44",
		daysLeft: "0 Days",
		daysLeft2: "100%",
	},
];
export default MyVault;
