import React from "react";
import dai from "../../../assets/img/token/dai.svg";
import inc from "../../../assets/img/token/inc.svg";
import pcap from "../../../assets/img/token/pcap.svg";
import pls from "../../../assets/img/token/pls.svg";
import plsx from "../../../assets/img/token/plsx.svg";
import usdc from "../../../assets/img/token/usdc.svg";
import usdt from "../../../assets/img/token/usdt.svg";
import weth from "../../../assets/img/token/weth.svg";
import CustomModal from "../../../components/CustomModal";
import {
	AngleDown,
	ClearIcon,
	telegram,
	twitter,
	youtube,
} from "../../../components/Icon";
import SectionHeader from "../../../components/SectionHeader";
import SelectModal from "../../../components/SelectModal";
import { cn } from "../../../utils/cn";

function toLocaleString(num, min, max, cutout) {
	const _number = isNaN(Number(num)) ? 0 : Number(num)
	if(cutout && num > 0 && num < cutout) return _number.toLocaleString(undefined, {minimumFractionDigits: max, maximumFractionDigits: max});
	else return _number.toLocaleString(undefined, {minimumFractionDigits: min, maximumFractionDigits: min});
}

const AmbassadorSection = ({...rest}) => {
	const [stakeNewModalOpen, setStakeNewModalOpen] = React.useState(false);
	const [approve, setApprove] = React.useState(false);
	const [lpdetailsOpen, setLpdetailsOpen] = React.useState(false);
	const [unstakeModalOpen, setUnStakeModalOpen] = React.useState(false);
	const [roiModalOpen, setRoiModalOpen] = React.useState(false);
	const [stakeModalOpen, setStakeModalOpen] = React.useState(false);
	const [zappedModal, setZappedModal] = React.useState(false);
	const [zapper, setZapper] = React.useState(0);
	const [amount, setAmount] = React.useState(0);
	const [index, setIndex] = React.useState(0);
	const [myStake, setMyStake] = React.useState("$100");
	const [dayStaked, setDayStaked] = React.useState("1DAY");
	const [selectedToken, setSelectedToken] = React.useState(0);

	// selectbox
	const [open, setOpen] = React.useState(false);
	const [activeIndex, setActiveIndex] = React.useState(0);
	const [activeToken, setActiveToken] = React.useState(
		selectOptions[0]
	);
	const [activeName, setActiveName] = React.useState("");

	const handleSelect = (index) => {
		setActiveIndex(index);
		if (index) {
			setActiveToken(selectOptions[0]);
		}
		setOpen(!open);
		setZappedModal(!zappedModal);
	};
	return (
		<section className="pt-[65px] md:pt-[117px] relative">
			<div
				className={cn(
					"w-full max-w-[1091px] h-[950px] blur-[200px] opacity-30 absolute bottom-[220px] left-1/2 -translate-x-1/2 bg-gradient7"
				)}
			/>
			<div className="container">
				<SectionHeader
					title="Ambassadors"
					subtitle="Team up with your favorite Influencers"
				/>
				<div className="pt-6">
					<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-[21px]">
						{data.map((item, index) => (
							<div
								className="rounded-[25px] relative group overflow-hidden before:gradient-border before:rounded-[inherit] before:bg-gradient8 before:!border-[2px] before:opacity-0 hover:before:opacity-100 before:duration-300 before:transition-all"
								key={index}
							>
								<img
									src={item.img}
									className="w-full rounded-[inherit]"
									alt=""
								/>
								<div className="team-social">
									{item.social.map((social, index) => (
										<a href={social.link} key={index} target="_blank">
											{social.icon}
										</a>
									))}
								</div>
								<div className="absolute w-full bottom-0 left-0 z-10 text-center pb-7">
									<h5 className="mb-3 text-normal font-bold">
										{item.name}
									</h5>
									<button
										className="btn-primary hover:after:!bg-none hover:after:bg-[#1C0050] hover:text-blue hover:after:opacity-100 justify-center !rounded-lg py-2 md:min-w-[150px]"
										type="button"
										onClick={() => {
											setActiveName(item.name);
											setIndex(index)
											setZappedModal(true);
										}}
									>
										<span>Join Team</span>
									</button>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
			<CustomModal
				open={zappedModal}
				setOpen={() => {
					setZappedModal(false);
				}}
				onlyChildren={true}
			>
				<div className="relative z-10 m-auto max-w-[480px] bg-gradient9 rounded-[10px] p-[1px] overflow-hidden fadeInUp">
					<img
						src="/img/asset-card-shape.png"
						className="absolute top-0 right-0 w-full rounded-[10px] blur-[75px]"
						alt=""
					/>
					<div className="bg-[#1C0050] rounded-[10px]">
						<div className="bg-lpDetailsGradient absolute -bottom-full left-0 w-full h-full blur-[75px]" />
						<div className="relative z-10 px-6">
							<div className="flex justify-between items-start py-4 rounded-t-[10px] font-semibold">
								<div className="w-0 flex-grow">
									<div className="text-lg mb-[9px]">
										Join Team - {activeName}
									</div>
									<div className="font-normal text-sm">
										Join Pulse Capital Presale on Team Stunna
									</div>
								</div>
								<button
									type="button"
									onClick={() => setZappedModal(false)}
								>
									<ClearIcon />
								</button>
							</div>
							<div className="bg-gradient8 h-[1px] opacity-50"></div>
							<div className="py-6">
								<div className="asset-card">
									<div className="rounded-[10px] bg-[#140236] text-center h-full">
										<div className="flex justify-between items-center">
											<div className="pt-4 pb-2 px-[14px] w-0 flex-grow">
												<input
													type="number"
													className="w-full text-md sm:text-lg xl:text-xl font-semibold bg-transparent border-0 outline-none text-left text-white placeholder:text-white"
													placeholder="0,00"
													value={amount}
												/>
												<div className="text-white text-opacity-50 text-sm font-medium text-left">
													${toLocaleString(amount, 2, 2, 0)}
												</div>
											</div>

											<button
												className="text-md sm:text-lg font-semibold pr-5 flex items-center gap-1"
												type="button"
												/*onClick={() => {
													setOpen(!open);
													setZappedModal(false);
												}}*/
											>
												<img src={activeToken?.img} alt="" />{" "}
												{activeToken?.title} {/*<AngleDown />*/}
											</button>
										</div>
										<div className="text-sm text-white text-opacity-30 border-t border-white border-opacity-20 py-1 mx-[14px] flex justify-between font-medium">
											<span>Balance:</span>
											<span>{toLocaleString(rest.daiBalance, 2, 2, 0)}</span>
										</div>
									</div>
								</div>
								<div className="">
									<div className="flex flex-wrap justify-center gap-1 my-[15px]">
										<button
											className={`day-btn ${
												zapper === 10 ? "active" : ""
											}`}
											onClick={() => {setAmount(rest.daiBalance/10); setZapper(10)}}
											type="button"
										>
											10%
										</button>
										<button
											className={`day-btn ${
												zapper === 25 ? "active" : ""
											}`}
											onClick={() =>{ setAmount(rest.daiBalance/4); setZapper(25)}}
											type="button"
										>
											25%
										</button>
										<button
											className={`day-btn ${
												zapper === 50 ? "active" : ""
											}`}
											onClick={() =>{ setAmount(rest.daiBalance/2); setZapper(50)}}
											type="button"
										>
											50%
										</button>
										<button
											className={`day-btn ${
												zapper === 75 ? "active" : ""
											}`}
											onClick={() => {setAmount(rest.daiBalance/4*3); setZapper(75)}}
											type="button"
										>
											75%
										</button>
										<button
											className={`day-btn ${
												zapper === 100 ? "active" : ""
											}`}
											onClick={() => {setAmount(rest.daiBalance); setZapper(100)}}
											type="button"
										>
											MAX
										</button>
									</div>
								</div>
								<div className="flex justify-evenly mb-8 md:mb-[43px]">
									<button
										type="button"
										className="h-[45px] sm:font-bold mt-[15px] px-4 sm:w-full max-w-[142px] bg-transparent text-white text-opacity-50 rounded-[5px] border border-white border-opacity-50"
										onClick={() => {
											setZappedModal(false);
										}}
									>
										Cancel
									</button>
									{rest.approved == true ? 
									<button
										type="button"
										className="btn-3 h-[45px] sm:font-bold mt-[15px] px-4 sm:w-full max-w-[142px] bg-menuHover"
										onClick={() => {
											setZappedModal(false);
											rest.deposit(index, amount)
										}}
									>
										Deposit
									</button> 
									: 
									<button
										type="button"
										className="btn-3 h-[45px] sm:font-bold mt-[15px] px-4 sm:w-full max-w-[142px] bg-menuHover"
										onClick={() => {
											rest.approve()
										}}
									>
										Approve
									</button>
									}
								</div>
							</div>
						</div>
					</div>
				</div>
			</CustomModal>
			<SelectModal
				handleSelect={handleSelect}
				value={activeToken}
				setValue={setActiveToken}
				options={selectOptions}
				open={open}
				setOpen={setOpen}
				activeIndex={activeIndex}
				setActiveIndex={setActiveIndex}
			/>
		</section>
	);
};
const data = [
	{
		img: "/img/ambassadors/1.png",
		name: "Moonshot Max",
		social: [
			{
				icon: telegram,
				link: "",
			},
			{
				icon: twitter,
				link: "",
			},
			{
				icon: youtube,
				link: "",
			},
		],
	},
	{
		img: "/img/ambassadors/2.png",
		name: "Crypto Mischief",
		social: [
			{
				icon: telegram,
				link: "",
			},
			{
				icon: twitter,
				link: "",
			},
			{
				icon: youtube,
				link: "",
			},
		],
	},
	{
		img: "/img/ambassadors/3.png",
		name: "Stunna Breezy",
		social: [
			{
				icon: telegram,
				link: "",
			},
			{
				icon: twitter,
				link: "",
			},
			{
				icon: youtube,
				link: "",
			},
		],
	},
	{
		img: "/img/ambassadors/4.png",
		name: "Mo Crypto",
		social: [
			{
				icon: telegram,
				link: "",
			},
			{
				icon: twitter,
				link: "",
			},
			{
				icon: youtube,
				link: "",
			},
		],
	},
	{
		img: "/img/ambassadors/5.png",
		name: "Experience Crypto 24/7",
		social: [
			{
				icon: telegram,
				link: "",
			},
			{
				icon: twitter,
				link: "",
			},
			{
				icon: youtube,
				link: "",
			},
		],
	},
	{
		img: "/img/ambassadors/13.png",
		name: "Scott The Investor",
		social: [
			{
				icon: telegram,
				link: "",
			},
			{
				icon: twitter,
				link: "",
			},
			{
				icon: youtube,
				link: "",
			},
		],
	},
	{
		img: "/img/ambassadors/6.png",
		name: "Jaime Crypto",
		social: [
			{
				icon: telegram,
				link: "",
			},
			{
				icon: twitter,
				link: "",
			},
			{
				icon: youtube,
				link: "",
			},
		],
	},
	{
		img: "/img/ambassadors/7.png",
		name: "Crypto Pride",
		social: [
			{
				icon: telegram,
				link: "",
			},
			{
				icon: twitter,
				link: "",
			},
			{
				icon: youtube,
				link: "",
			},
		],
	},
	{
		img: "/img/ambassadors/8.png",
		name: "Drip Millionz",
		social: [
			{
				icon: telegram,
				link: "",
			},
			{
				icon: twitter,
				link: "",
			},
			{
				icon: youtube,
				link: "",
			},
		],
	},
	{
		img: "/img/ambassadors/9.png",
		name: "Legacy 7 Crypto",
		social: [
			{
				icon: telegram,
				link: "",
			},
			{
				icon: twitter,
				link: "",
			},
			{
				icon: youtube,
				link: "",
			},
		],
	},
	{
		img: "/img/ambassadors/10.png",
		name: "Crypto Neptune",
		social: [
			{
				icon: telegram,
				link: "",
			},
			{
				icon: twitter,
				link: "",
			},
			{
				icon: youtube,
				link: "",
			},
		],
	},
	{
		img: "/img/ambassadors/11.png",
		name: "Drip to Wealth",
		social: [
			{
				icon: telegram,
				link: "",
			},
			{
				icon: twitter,
				link: "",
			},
			{
				icon: youtube,
				link: "",
			},
		],
	},
	{
		img: "/img/ambassadors/12.png",
		name: "The Warriors DAO",
		social: [
			{
				icon: telegram,
				link: "",
			},
			{
				icon: twitter,
				link: "",
			},
			{
				icon: youtube,
				link: "",
			},
		],
	},
];

const selectOptions = [
	{
		img: dai,
		title: "DAI",
		subtitle: "DAI From Ethereum",
		value: "59,300.45",
	}
];

export default AmbassadorSection;
