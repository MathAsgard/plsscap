import React from "react";
import { Link } from "react-router-dom";
import {
	ArrowRight,
	Telegram,
	Twitter,
	Youtube,
} from "../../../components/Icon";

const Banner = () => {
	return (
		<section
			className="py-[160px] xl:pt-[299px] xl:pb-[363px]"
			style={{
				background: `url('/img/banner/banner-bg.png') no-repeat center center / cover`,
			}}
		>
			<div
				className="container xl:max-w-[1090px]"
				style={{ animation: "fadeInUp 1s ease-in-out" }}
			>
				<div className="flex flex-wrap sm:flex-nowrap gap-10 justify-between items-center">
					<div className="w-full max-w-[520px]">
						<h2 className="text-2xl md:text-6xl mb-2 md:mb-0">
							Introducing
						</h2>
						<h1 className="text-6xl md:text-7xl lg:text-[82px] font-bold leading-[1.2] md:leading-[98px] mb-3">
							<span className="text-gradient-6">
								Pulse{" "}
								<span className="text-gradient-white">Capital</span>
							</span>
						</h1>
						<h5 className="text-gradient text-xl leading-[1.3] md:text-4xl mb-[13px]">
							The Gateway to Financial Growth
						</h5>
						<p className="text-md lg:text-lg">
							With Pulse Capital, you're not limited to conventional
							earning strategies. Our three-pronged approach offers a
							diverse range of options to suit every investor's goals and
							risk appetite.
						</p>
						<div className="flex flex-wrap gap-x-6 gap-y-4 mt-[27px] items-center">
							<Link to="/capital-farms" className="btn-primary">
								<span>Start Staking</span>{" "}
								<span className="text-black">
									<ArrowRight />
								</span>
							</Link>
							<div className="relative">
								<div className="absolute inset-0 gradient-border rounded-full" />
								<div className="flex flex-wrap gap-2 gap-x-6 px-5 py-2 rounded-full relative">
									<h6 className="font-semibold text-capitalize">
										Our Socials
									</h6>
									<Link href="#" className="block">
										<Telegram />
									</Link>
									<Link href="#" className="block">
										<Twitter />
									</Link>
									<Link href="#" className="block">
										<Youtube />
									</Link>
								</div>
							</div>
						</div>
					</div>
					<div className="w-full max-w-[170px] lg:max-w-[300px]">
						<img
							src="/img/banner/logo.png"
							className="max-w-full"
							alt=""
						/>
					</div>
				</div>
			</div>
		</section>
	);
};

export default Banner;
