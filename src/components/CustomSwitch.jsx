import React from "react";
import {
	CheckedIcon,
	CheckedIconSmall,
	UncheckedIcon,
	UncheckedIconSmall,
} from "./Icon";

const CustomSwitch = ({ value, label, setValue, size }) => {
	return (
		<>
			<label
				className={`flex items-center text-nowrap gap-2 text-md text-white text-opacity-50 cursor-pointer ${
					size == "md" ? "font-semibold" : "font-medium"
				}`}
			>
				<input
					type="checkbox"
					checked={value}
					onChange={(e) => setValue(e.target.checked)}
					className="hidden"
				/>
				{size == "md" ? (
					<>{value ? <CheckedIcon /> : <UncheckedIcon />}</>
				) : (
					<>{value ? <CheckedIconSmall /> : <UncheckedIconSmall />}</>
				)}
				{label && <span>{label}</span>}
			</label>
		</>
	);
};

export default CustomSwitch;
