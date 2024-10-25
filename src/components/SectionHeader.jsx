import React from "react";

const SectionHeader = ({ title, subtitle }) => {
	return (
		<div className="mb-8 md:mb-11">
			<h2 className="text-3xl sm:text-[48px] sm:leading-[58px] font-medium text-white text-center flex items-center gap-[38px]">
				<span
					className="flex-grow h-[1px]"
					style={{
						background:
							"linear-gradient(90deg, rgba(149, 6, 249, 0.05) 0%, rgba(178, 57, 250, 0.4) 26%, #DB39F8 49.5%, #3D44FF 75.5%, #01EAFF 100%)",
					}}
				></span>
				<span>{title}</span>
				<span
					className="flex-grow h-[1px]"
					style={{
						background:
							"linear-gradient(90deg, #9506F9 0%, #B239FA 26%, #DB39F8 49.5%, rgba(61, 68, 255, 0.4) 75.5%, rgba(1, 234, 255, 0.05) 100%)",
					}}
				></span>
			</h2>
			<div className="text-white text-opacity-50 font-medium text-center">
				{subtitle}
			</div>
		</div>
	);
};

export default SectionHeader;
