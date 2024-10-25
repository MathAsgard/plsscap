import { Option, Select } from "@material-tailwind/react";
import React from "react";
// import ReactSelect from "react-select";

const CustomSelectTwo = ({
	options,
	className,
	label,
	value,
	setValue,
	dropDownFilter,
	setSelectedIndex,
	...rest
}) => {
	return (
		<>
			<div className="custom-select-2">
				<Select
					variant="outlined"
					label={label ? label : ""}
					className={`${
						className ? className : ""
					} custom-select before:bg-gradient9 [&.border-2]:before:bg-red [&.border-2]:after:block after:bg-[#10032F]`}
					labelProps={{ className: value ? "hidden" : "" }}
					onChange={(e) =>{
						setValue(e);
					}}
					{...rest}
				>
					{options?.map((item, index) => (
						<Option key={index} value={item.value} 
							onClick={() => {
							dropDownFilter(options[index].value);
							if(setSelectedIndex) setSelectedIndex(index);
						}}>
							{item.value}
						</Option>
					))}
				</Select>
				{/* <ReactSelect
					value={value}
					onChange={setValue}
					options={options}
					label={label ? label : "Select"}
				/> */}
			</div>
		</>
	);
};

export default CustomSelectTwo;
