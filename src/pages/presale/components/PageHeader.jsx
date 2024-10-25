import React from "react";
import AmbassadorCards from "./AmbassadorCards";
import PresaleCountdown from "./PresaleCountdown";

const PageHeader = ({ title, subtitle, text, miniFav, ...rest}) => {
	return (
		<section className="pt-6 md:pt-12 lg:pt-[135px]">
			<div className="container xl:max-w-[1300px]">
				<div className="p-[1px] shadow-chipShadow bg-gradient5 relative z-10 rounded-[10px]">
					<div
						className="pt-[40px] pb-[80px] md:pb-[98px] md:pr-6 lg:px-[60px] rounded-[10px] relative"
						style={{
							background: `url('/img/page-header.png') no-repeat center center / cover`,
						}}
					>
						<div className="text-center">
							<div className="mb-4">
								<PresaleCountdown
									targetDate={`June 30, 2025 00:00:00`}
								/>
							</div>
							<h1 className="text-2xl md:text-3xl lg:text-[40px] font-semibold">
								Ambassador Pre-Launch
							</h1>
							<p className="font-medium text-white text-opacity-50 mt-1 mb-[18px]">
								Gain a competitive edge by participating in pre-launch
							</p>
							<div className="font-medium max-w-[759px] mx-auto md:text-md lg:text-lg px-6 md:px-0 text-gradient-4">
								Access exclusive investment opportunities and
								early-stage projects with our Presale Platform. Join the
								journey of innovation and growth in the decentralized
								finance space.
							</div>
						</div>
						<img
							src={miniFav}
							alt=""
							className="absolute right-4 bottom-4 md:right-[41px] md:bottom-[34px]"
						/>
					</div>
				</div>
				<AmbassadorCards userPoints={rest.userPoints} totalPoints={rest.totalPoints}/>
			</div>
		</section>
	);
};

export default PageHeader;
