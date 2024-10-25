/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { Link } from "react-router-dom";
import { GoToTop } from "./Icon";
import { TeamModal } from "./TeamModal";

const Footer = () => {
	const [teamModal, setTeamModal] = React.useState(false);
	return (
		<>
			<footer className="bg-footerBg">
				<div
					style={{
						background: `url('/img/footer-bg.png') no-repeat center center / cover`,
					}}
				>
					<div className="container xl:max-w-[1424px]">
						<div className="pt-[35px] pb-[57px]">
							<div className="flex flex-wrap gap-10 justify-between">
								<div className="w-full md:max-w-[479px]">
									<Link
										to="#"
										className="block max-w-[200px] sm:max-w-[286px] mb-[20px]"
									>
										<img
											src="/img/footer-logo.svg"
											className="w-full"
											alt=""
										/>
									</Link>
									<p>
										Experience the power of decentralized finance like
										never before. Join our vibrant community of
										investors, farmers, and innovators, and embark on
										a journey towards financial freedom and
										prosperity. With Pulse Capital, the possibilities
										are limitless – seize them today.
									</p>
								</div>
								<div className="flex flex-wrap sm:flex-nowrap gap-8 xl:gap-[56px] w-full md:w-[unset]">
									{data?.map((item, index) => (
										<div key={index}>
											<h6 className="text-lg md:text-xl mb-[20px] font-bold text-gradient-3">
												{item.title}
											</h6>
											<ul className="flex flex-col gap-4">
												{item.links?.map((link, index) => (
													<li key={index}>
														{link.name === "Team" ? (
															<button
																className="inline-block md:text-md font-medium"
																type="button"
																onClick={() =>
																	setTeamModal(!teamModal)
																}
															>
																{link.name}
															</button>
														) : (
															<Link
																to={link.url}
																className="inline-block md:text-md font-medium"
															>
																{link.name}
															</Link>
														)}
													</li>
												))}
											</ul>
										</div>
									))}
									<div className="ml-auto">
										<a href="#" className="block">
											<GoToTop />
										</a>
									</div>
								</div>
							</div>
						</div>
						<div className="bg-gradient4 h-[1px] opacity-50"></div>
						<div className="py-[26px] flex gap-4 flex-wrap justify-around sm:justify-between text-center">
							<div className="font-medium">
								&copy; 2024{" "}
								<span className="text-gradient-2 font-semibold">
									Pulse
								</span>{" "}
								<span className="font-semibold">Capital</span>. All
								Rights Reserved
							</div>
							<div className="flex gap-[9px] items-center justify-center">
								<span>Powered by</span>
								<img
									src="/img/partner/5.png"
									className="w-[70px]"
									alt=""
								/>
							</div>
						</div>
					</div>
				</div>
			</footer>
			<TeamModal open={teamModal} setOpen={setTeamModal} />
		</>
	);
};
const data = [
	{
		title: "Products",
		links: [
			{
				name: "Capital Farms",
				url: "/capital-farms",
			},
			{
				name: "Heart Fund",
				url: "/heart-fund",
			},
			{
				name: "Stock Vault",
				url: "/stock-vault",
			},
		],
	},
	{
		title: "Learn",
		links: [
			{
				name: "Team",
				url: "/team",
			},
			{
				name: "Medium",
				url: "#",
			},
			{
				name: "Audits",
				url: "#",
			},
		],
	},
	{
		title: "Community",
		links: [
			{
				name: "Telegram",
				url: "#",
			},
			{
				name: "Twitter",
				url: "#",
			},
			{
				name: "Youtube",
				url: "#",
			},
		],
	},
];
export default Footer;
