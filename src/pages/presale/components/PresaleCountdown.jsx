import React from "react";

import Countdown from "react-countdown";
const renderer = ({
	days,
	hours,
	minutes,
	seconds,
	completed,
	className,
	shortend,
	showDays,
}) => {
	hours = (days % 24) + hours;
	if (completed) {
		return <span style={{ color: "#DC3545" }}>Presale has Ended!</span>;
	} else {
		return (
			<div
				className={`flex items-center justify-center gap-[3px] ${className}`}
			>
				<div className="countdown-item">
					<span className="text-4xl font-extrabold">
						{days < 10 ? `0${days}` : days}
					</span>
					<div className="text-xs font-extrabold uppercase mt-[2px]">
						days
					</div>
				</div>
				<div className="countdown-item">
					<span className="text-4xl font-extrabold">
						{hours < 10 ? `0${hours}` : hours}
					</span>
					<div>hours</div>
				</div>
				<div className="countdown-item">
					<span className="text-4xl font-extrabold">
						{minutes < 10 ? `0${minutes}` : minutes}
					</span>
					<div className="text-xs font-extrabold uppercase mt-[2px]">
						minutes
					</div>
				</div>
				<div className="countdown-item">
					<span className="text-4xl font-extrabold">
						{seconds < 10 ? `0${seconds}` : seconds}
					</span>
					<div className="text-xs font-extrabold uppercase mt-[2px]">
						seconds
					</div>
				</div>
			</div>
		);
	}
};
const PresaleCountdown = ({ targetDate }) => {
	const convertDate = (date, tzString) => {
		return new Date(
			(typeof date === "string" ? new Date(date) : date).toLocaleString(
				"en-US",
				{ timeZone: tzString }
			)
		);
	};
	return (
		<Countdown
			date={convertDate(targetDate, "Asia/singapore")}
			renderer={renderer}
		/>
	);
};

export default PresaleCountdown;
