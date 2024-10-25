import React from "react";
import CustomModal from "./CustomModal";
import { ClearIcon } from "./Icon";

const SelectModal = ({
	handleSelect,
	options,
	value,
	setValue,
	open,
	setOpen,
	activeIndex,
	setActiveIndex,
}) => {
	return (
		<>
			<CustomModal open={open} setOpen={handleSelect} onlyChildren={true}>
				<div className="relative z-10 m-auto max-w-[480px] bg-gradient9 rounded-[10px] p-[1px] overflow-hidden fadeInUp">
					<img
						src="/img/asset-card-shape.png"
						className="absolute top-0 right-0 w-full rounded-[10px] blur-[75px]"
						alt=""
					/>
					<div className="bg-[#1C0050] rounded-[10px]">
						<div className="bg-lpDetailsGradient absolute -bottom-full left-0 w-full h-full blur-[75px]" />
						<div className="sticky top-0 z-10 px-6">
							<div className="flex justify-between items-start py-4 rounded-t-[10px] font-semibold">
								<div className="w-0 flex-grow">
									<div className="text-lg">Select a Token</div>
								</div>
								<button
									type="button"
									onClick={() => {
										setOpen(false);
										handleSelect?.(activeIndex);
									}}
								>
									<ClearIcon />
								</button>
							</div>
							<div className="pb-2">
								<div className="w-full bg-gradient8 p-[1px] rounded-[5px]">
									<input
										type="text"
										className="w-full h-[50px] border-0 outline-0 bg-[#10032F] font-medium text-white placeholder:text-white placeholder:text-opacity-50 px-[18px] rounded-[5px]"
										placeholder="Search name or paste address"
									/>
								</div>
							</div>
						</div>

						<div className="pb-6 relative z-10 flex flex-col gap-2">
							{options.map((option, index) => (
								<button
									key={index}
									className={`flex justify-between items-center py-[2px] px-[25px] w-full text-left hover:bg-[#150238] ${
										activeIndex === index ? "bg-[#150238]" : ""
									}`}
									onClick={() => {
										handleSelect?.(index);
									}}
								>
									<div className="flex items-center gap-[7px] w-0 flex-grow">
										<img
											src={option?.img}
											alt=""
											className="w-[30px] h-[30px]"
										/>
										<div className="w-0 flex-grow font-medium">
											<div className="uppercase font-bold">
												{option?.title}
											</div>
											<div className="text-sm text-white text-opacity-50">
												{option?.subtitle}
											</div>
										</div>
										{option?.value && (
											<div className="font-medium">
												{Number(option.value).toLocaleString({maximumFractionDigits:2})}
											</div>
										)}
									</div>
								</button>
							))}
						</div>
					</div>
				</div>
			</CustomModal>
		</>
	);
};

export default SelectModal;
