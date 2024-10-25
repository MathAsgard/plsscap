// import { Option, Select } from "@material-tailwind/react";
import { Option, Select } from "@material-tailwind/react";
import React from "react";

const CustomSelect = ({ options, setValue, value, label, className }) => {
	return (
		<>
			<Select
				variant="outlined"
				label={label ? label : "Select"}
				className={`${className ? className : ""} custom-select`}
				labelProps={{ className: value ? "hidden" : "" }}
				onChange={(e) => setValue(e)}
			>
				{options?.map((item, index) => (
					<Option key={index} value={item.value}>
						{item.value}
					</Option>
				))}
			</Select>
			{/* 
			<ReactSelect
				value={value}
				onChange={setValue}
				options={options}
				label={label ? label : "Select"}
			/> */}
		</>
	);
};

export default CustomSelect;
