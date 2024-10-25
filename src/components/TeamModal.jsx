import React from "react";
import CustomModal from "./CustomModal";
import { ClearIcon } from "./Icon";

export function TeamModal({ open, setOpen }) {
	return (
		<>
			<CustomModal
				open={open}
				setOpen={setOpen}
				className="bg-transparent"
				onlyChildren={true}
			>
				<div
					className="bg-none relative rounded-[10px] w-full max-w-[1412px] m-auto fadeInUp"
					style={{
						background:
							"linear-gradient(0deg, #070115 0%, #070115 100%), linear-gradient(180deg, #04010F 0%, #0B0021 25.5%, #17003C 47.5%, #2E016A 68%, #480188 83%, #700792 100%)",
					}}
				>
					<div className="noisy-bg top-1/2 -translate-y-1/2 w-[50%]" />
					<div className="gradient-border bg-gradient3" />
					<div className="relative text-white font-urbanist py-12 z-[11]">
						<button
							type="button"
							className="absolute right-4 top-4 z-10"
							onClick={() => setOpen(false)}
						>
							<ClearIcon />
						</button>
						<div className="pb-12 md:pb-[68px] px-4">
							<h5 className="text-4xl sm:text-6xl font-semibold text-center mb-2">
								<div>
									<span className="text-gradient-2 bg-gradient7">
										The Core Team
									</span>
								</div>
							</h5>
							<div className="text-md xl:text-lg max-w-[655px] mx-auto text-center">
								At Pulse Capital, our success is fueled by a team of
								visionary leaders dedicated to pushing the boundaries of
								decentralized finance (DeFi). Meet the masterminds
								behind our platform's innovative solutions:
							</div>
						</div>
						<div className="flex flex-wrap justify-center xl:max-w-[1060px] mx-auto md:px-8 gap-y-10">
							{data?.map((item, index) => (
								<div
									className="text-center w-full md:w-[33%] px-3 xl:px-8"
									key={index}
								>
									<img
										src={item.img}
										className="w-full mb-8 md:mb-12 max-w-[140px] md:max-w-[205px] xl:max-w-[295px] mx-auto"
										alt=""
									/>
									<h5 className="text-gradient-4 text-xl font-bold">
										{item.name}
									</h5>
									<div className="font-medium text-white text-opacity-50 mt-[10px] leading-[19px]">
										{item.username}
									</div>
									<div className="font-medium text-white mt-[10px] leading-[19px]">
										{item.designation}
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			</CustomModal>
		</>
	);
}
const data = [
	{
		img: "/img/team/1.svg",
		name: "Moonshot Max",
		username: "@MoonshotmaxCrypto",
		designation: "Marketing Lead",
	},
	{
		img: "/img/team/2.svg",
		name: "Math",
		username: "@MathAsgard",
		designation: "Lead Dev",
	},
	{
		img: "/img/team/3.svg",
		name: "The Nomad",
		username: "@CryptoNomad",
		designation: "Frontend Dev",
	},
];
