import React from "react";

const CustomModal = ({ open, setOpen, width, children, onlyChildren }) => {
	if (open)
		return (
			<>
				<div
					className={`fixed w-full left-0 top-0 h-full z-[99999]  px-4 py-8 transition-all duration-400 flex ${
						open ? "opacity-1" : "opacity-0"
					}`}
				>
					<div
						className="absolute inset-0 bg-black bg-opacity-50"
						onClick={() => setOpen(false)}
					/>
					<div className="w-full m-auto max-h-full overflow-y-auto">
						{onlyChildren ? (
							children
						) : (
							<div
								className={` bg-white rounded-[20px] p-8 relative z-[999] mx-auto fadeInUp`}
								style={{ maxWidth: width ? width : "528px" }}
							>
								{children}
							</div>
						)}
					</div>
				</div>
				{open ? (
					<style>
						{`
				body {
					overflow: hidden;
				}
				.header-section {
					z-index: 1;
					transition: all ease 0.3s;
					opacity: 0;
				}
			`}
					</style>
				) : (
					""
				)}
			</>
		);
};

export default CustomModal;
