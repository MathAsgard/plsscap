import React from "react";
import ScrollAnimation from "react-animate-on-scroll";
import Marquee from "react-fast-marquee";

const Partner = () => {
	return (
		<section className="pt-[0] sm:pt-[60px] xl:pt-[160px] pb-[80px] sm:pb-[120px] xl:pb-[288px] relative">
			<div className="noisy-bg" />
			<ScrollAnimation animateIn="fadeInDown" animateOnce={true}>
				<div className="container">
					<h2 className="text-xl font-medium mb-[44px] text-center">
						<span className="text-gradient-4">Powered by</span>
					</h2>
					<div className="max-w-[902px] mx-auto">
						<Marquee gradient={false} speed={40}>
							{data.map((item, index) => (
								<img
									key={index}
									src={item.img}
									alt=""
									className="mx-[20px]"
								/>
							))}
						</Marquee>
					</div>
				</div>
			</ScrollAnimation>
		</section>
	);
};
const data = [
	{
		img: "/img/partner/1.png",
	},
	{
		img: "/img/partner/2.png",
	},
	{
		img: "/img/partner/3.png",
	},
	{
		img: "/img/partner/4.png",
	},
	{
		img: "/img/partner/5.png",
	},
];
export default Partner;
