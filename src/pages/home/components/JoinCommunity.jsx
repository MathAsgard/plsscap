import React from "react";
import ScrollAnimation from "react-animate-on-scroll";
import { Link } from "react-router-dom";
import { Telegram, Twitter, Youtube } from "../../../components/Icon";

const JoinCommunity = () => {
	return (
		<section className="py-[80px] xl:py-[143px]">
			<div className="container xl:max-w-[1226px]">
				<ScrollAnimation animateIn="fadeInDown" animateOnce={true}>
					<div className="flex justify-between items-center flex-wrap gap-6">
						<div className="w-full sm:w-0 flex-grow text-center md:text-start">
							<h2 className="text-4xl lg:text-6xl xl:text-[64px] font-medium xl:leading-[77px] text-gradient-4 mb-2">
								Join our Community
							</h2>
							<div className="text-md xl:text-xl">
								Together we can make this DeFi Community even stronger
							</div>
						</div>
						<div className="flex items-center gap-12 justify-center md:justify-start mx-auto">
							<Link href="#" className="block">
								<Telegram className="w-8 md:w-[55px]" />
							</Link>
							<Link href="#" className="block">
								<Twitter className="w-8 md:w-[55px]" />
							</Link>
							<Link href="#" className="block">
								<Youtube className="w-8 md:w-[55px]" />
							</Link>
						</div>
					</div>
				</ScrollAnimation>
			</div>
		</section>
	);
};

export default JoinCommunity;
