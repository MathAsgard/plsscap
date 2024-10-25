import "@material-tailwind/react";
import React from "react";
import CustomSelect from "../../../components/CustomSelect";
const Transactions = () => {
	const [value, setValue] = React.useState("");
	const [value2, setValue2] = React.useState("");
	return (
		<section className="relative z-[99] pt-[70px]">
			<div className="noisy-bg top-[-100px]" />
			<div className="container xl:max-w-[1300px] relative z-10">
				<div className="mb-4 sm:mb-[38px]">
					<div className="flex flex-wrap gap-y-5">
						<h5 className="text-2xl sm:text-[40px] font-medium flex items-center gap-5 flex-grow">
							<div>My Transactions</div>
							<span className="w-0 flex-grow bg-gradient8 h-[2px]"></span>
						</h5>
						<div className="flex flex-wrap gap-x-2 sm:gap-x-0 gap-y-2 items-center">
							<div className="select-custom1">
								<CustomSelect
									value={value}
									setValue={setValue}
									label="Select Protocol"
									options={[
										{
											value: "Capital Farms",
											label: "Capital Farms",
										},
										{
											value: "Heart Fund",
											label: "Heart Fund",
										},
										{
											value: "STOCK Fund",
											label: "STOCK Fund",
										},
										{
											value: "Convert",
											label: "Convert",
										},
									]}
								/>
							</div>
							<span className="w-0 flex-grow bg-gradient8 h-[1px] min-w-7 sm:block hidden"></span>
							<div className="select-custom2">
								<CustomSelect
									value={value2}
									setValue={setValue2}
									label="Filter By"
									options={[
										{
											value: "Stake",
											label: "Stake",
										},
										{
											value: "Unstake",
											label: "Unstake",
										},
										{
											value: "Claim",
											label: "Claim",
										},
										{
											value: "Lock",
											label: "Lock",
										},
									]}
								/>
							</div>
						</div>
					</div>
				</div>
				<div className="relative z-10 rounded-t-none rounded-b-[10px]">
					<div className="gradient-border bg-tableGradient inset-[1px] top-[75px] z-10 before:h-[2px] before:w-full before:absolute before:left-0 before:top-[-1px] before:bg-tableBg" />
					<div className="rounded-[10px] bg-tableBg px-4 pb-4 xl:px-[43px] xl:pb-[43px] overflow-hidden">
						<div
							className="absolute left-0 right-0 bottom-0 top-[75px]"
							style={{
								background: `url('/img/table-overlay.png') no-repeat center center / cover`,
							}}
						/>
						<div className="gradient-border h-[75px] bg-gradient9" />
						<div className="overflow-x-auto relative z-10">
							<table className="custom-table">
								<thead>
									<tr className="md:text-lg">
										<th className="p-4 font-semibold text-nowrap">
											Transaction
										</th>
										<th className="p-4 font-semibold text-nowrap">
											Token
										</th>
										<th className="p-4 font-semibold text-nowrap">
											Protocol
										</th>
										<th className="p-4 font-semibold text-nowrap">
											Transaction
										</th>
										<th className="p-4 font-semibold text-nowrap">
											Time
										</th>
									</tr>
									<tr>
										<th className="md:p-4"></th>
									</tr>
								</thead>
								<tbody>
									{data.map((item, index) => (
										<tr className="text-center" key={index}>
											<td className="custom-table-td">
												<div className="md:font-semibold text-nowrap">
													<span className="text-gradient-2 mr-1">
														{item.trxTypeGradient}
													</span>
													<span>{item.trxType}</span>
												</div>
											</td>
											<td className="custom-table-td">
												<div className="md:font-semibold text-nowrap">
													<span>{item.token1}</span>
													<span className="text-gradient-3 ml-1">
														{item.token2}
													</span>
												</div>
											</td>
											<td className="custom-table-td">
												<span className="md:font-semibold text-nowrap">
													{item.protocol}
												</span>
											</td>
											<td className="custom-table-td">
												<span className="md:font-semibold text-nowrap">
													{item.transaction2}
												</span>
											</td>
											<td className="custom-table-td">
												<span className="md:font-semibold text-nowrap">
													{item.time}
												</span>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};
const data = [
	{
		trxType: "Stake",
		trxTypeGradient: "",
		token1: "2499.67",
		token2: "ETH-WPLS LP",
		protocol: "Capital Farms",
		transaction2: "0x55bbe...a2d6ac10",
		time: "Mar 12, 2024, 03:27pm",
	},
	{
		trxType: "Claim",
		trxTypeGradient: "",
		token1: "2499.67",
		token2: "ETH-WPLS LP",
		protocol: "Heart Fund",
		transaction2: "0x55bbe...a2d6ac10",
		time: "Mar 12, 2024, 03:27pm",
	},
	{
		trxType: "Rewards",
		trxTypeGradient: "Claim ",
		token1: "2499.67",
		token2: "ETH-WPLS LP",
		protocol: "STOCK Lock",
		transaction2: "0x55bbe...a2d6ac10",
		time: "Mar 12, 2024, 03:27pm",
	},
	{
		trxType: "",
		trxTypeGradient: "Unstake",
		token1: "2499.67",
		token2: "ETH-WPLS LP",
		protocol: "Heart Fund",
		transaction2: "0x55bbe...a2d6ac10",
		time: "Mar 12, 2024, 03:27pm",
	},
	{
		trxType: "",
		trxTypeGradient: "Convert",
		token1: "2499.67",
		token2: "ETH-WPLS LP",
		protocol: "Convert",
		transaction2: "0x55bbe...a2d6ac10",
		time: "Mar 12, 2024, 03:27pm",
	},
	{
		trxType: "Stake",
		trxTypeGradient: "",
		token1: "2499.67",
		token2: "ETH-WPLS LP",
		protocol: "Capital Farms",
		transaction2: "0x55bbe...a2d6ac10",
		time: "Mar 12, 2024, 03:27pm",
	},
	{
		trxType: "Claim",
		trxTypeGradient: "",
		token1: "2499.67",
		token2: "ETH-WPLS LP",
		protocol: "Heart Fund",
		transaction2: "0x55bbe...a2d6ac10",
		time: "Mar 12, 2024, 03:27pm",
	},
	{
		trxType: "Rewards",
		trxTypeGradient: "Claim ",
		token1: "2499.67",
		token2: "ETH-WPLS LP",
		protocol: "STOCK Lock",
		transaction2: "0x55bbe...a2d6ac10",
		time: "Mar 12, 2024, 03:27pm",
	},
	{
		trxType: "",
		trxTypeGradient: "Unstake",
		token1: "2499.67",
		token2: "ETH-WPLS LP",
		protocol: "Heart Fund",
		transaction2: "0x55bbe...a2d6ac10",
		time: "Mar 12, 2024, 03:27pm",
	},
	{
		trxType: "",
		trxTypeGradient: "Convert",
		token1: "2499.67",
		token2: "ETH-WPLS LP",
		protocol: "Convert",
		transaction2: "0x55bbe...a2d6ac10",
		time: "Mar 12, 2024, 03:27pm",
	},
	{
		trxType: "Rewards",
		trxTypeGradient: "Claim ",
		token1: "2499.67",
		token2: "ETH-WPLS LP",
		protocol: "STOCK Lock",
		transaction2: "0x55bbe...a2d6ac10",
		time: "Mar 12, 2024, 03:27pm",
	},
];
export default Transactions;
