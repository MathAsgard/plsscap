import React from "react";
import { cn } from "../../../utils/cn";

function toLocaleString(num, min, max, cutout) {
	const _number = isNaN(Number(num)) ? 0 : Number(num)
	if(cutout && num > 0 && num < cutout) return _number.toLocaleString(undefined, {minimumFractionDigits: max, maximumFractionDigits: max});
	else return _number.toLocaleString(undefined, {minimumFractionDigits: min, maximumFractionDigits: min});
}
  
const AmbassadorCards = ({...rest}) => {
	data[2].amount = toLocaleString(rest.userPoints, 2, 2, 0)
	data[2].subtitle = "$" + toLocaleString(rest.userPoints, 2, 2, 0)
	data[3].amount = toLocaleString(rest.totalPoints, 2, 2, 0)
	data[3].subtitle = "$" + toLocaleString(rest.totalPoints, 2, 2, 0)
	data[4].amount = toLocaleString((rest.userPoints/rest.totalPoints)*100, 2, 2, 0) + "%"
	return (
		<section className="py-[50px]">
			<div className="container xl:max-w-[1267px]">
				<div className="flex gap-y-8 flex-wrap gap-3 sm:gap-y-12 sm:gap-4 justify-around items-start">
					{data.map((item, index) => (
						<div
							className={cn("dashboard-card dashboard-card-2", {
								muted: item.muted,
								hovered: !item.muted && !item.dai,
							})}
							key={index}
						>
							<img
								src={item.img}
								className="absolute left-0 w-full shapes"
								alt=""
							/>
							<h6
								className={cn(
									"text-xs sm:text-normal font-semibold -translate-y-1/2 mx-4 m-0 -mb-2",
									{
										"text-white text-opacity-20": item.muted,
										"font-medium": !item.muted,
									}
								)}
							>
								{item.title}
							</h6>
							<div className="bg-tableBg shadow-innerShadow rounded-[5px]">
								<h2
									className={cn(
										"text-[17px] leading-[30px] md:text-xl font-semibold pt-[8px] pb-[5px]",
										{
											"text-white text-opacity-20": item.muted,
											"text-gradient-3": !item.muted && !item.dai,
										}
									)}
								>
									{item.amount}{" "}
									<span className="opacity-40">
										{item.dai ? "DAI" : ""}
									</span>
								</h2>
								<p className="text-white text-opacity-50 pt-[6px] pb-2 md:pb-[2px] border-t border-white border-opacity-30">
									{item.subtitle}
								</p>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
};

const data = [
	{
		title: "Soft Cap",
		amount: "$200,000",
		subtitle: "Target Raise",
		img: "/img/ambassador-card-bg-1.png",
		muted: true,
	},
	{
		title: "Hard Cap",
		amount: "$500,000",
		subtitle: "Max Raise",
		img: "/img/ambassador-card-bg-1.png",
		muted: true,
	},
	{
		title: "My Contribution",
		amount: "5000",
		dai: "DAI",
		subtitle: "$5,000",
		img: "/img/ambassador-card-bg-2.png",
		muted: false,
	},
	{
		title: "Total Contribution",
		amount: "480,000.00",
		dai: "DAI",
		subtitle: "$480,000",
		img: "/img/ambassador-card-bg-2.png",
		muted: false,
	},
	{
		title: "My % of Presale",
		amount: "8.32%",
		subtitle: "My share",
		img: "/img/dashboard-card-bg.png",
		muted: false,
	},
];
export default AmbassadorCards;
