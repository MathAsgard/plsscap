import { Accordion } from "@material-tailwind/react";
import React from "react";
import { FaqIcon } from "./Icon";

const Faqs = () => {
	const [open, setOpen] = React.useState(null);
	return (
		<>
			<section className="py-[65px] md:pb-[117px] relative">
				<div className="w-full max-w-[1091px] h-[386px] blur-[200px] opacity-30 bg-gradient7 absolute top-[-100px] left-1/2 -translate-x-1/2" />
				<div className="container xl:max-w-[1070px] relative z-10">
					<div className="text-center mb-[26px]">
						<h2 className="text-3xl sm:text-[40px] sm:leading-[48px] font-black text-white mb-2">
							FAQ
						</h2>
						<div className="text-gradient font-medium">
							"Frequently Asked Questions about Capital Farms
						</div>
					</div>
					<div className="flex flex-wrap gap-4 xl:gap-x-10">
						<div className="flex flex-col gap-4 w-full md:w-[40%] flex-grow">
							{data.map(
								(item, index) =>
									index % 2 === 0 && (
										<FaqItem
											index={index}
											key={index}
											setOpen={setOpen}
											item={item}
											open={open}
										/>
									)
							)}
						</div>
						<div className="flex flex-col gap-4 w-full md:w-[40%] flex-grow">
							{data.map(
								(item, index) =>
									index % 2 === 1 && (
										<FaqItem
											index={index}
											key={index}
											setOpen={setOpen}
											item={item}
											open={open}
										/>
									)
							)}
						</div>
					</div>
				</div>
			</section>
		</>
	);
};
const FaqItem = ({ item, index, setOpen, open }) => {
	return (
		<Accordion
			key={item.id}
			open={open === index}
			onClick={() => (open === index ? setOpen(null) : setOpen(index))}
			className="bg-gradient9 rounded-[5px] p-[1px]"
		>
			<div className="bg-[#10032F] rounded-[5px]">
				<Accordion.Header className="px-[13px] py-[8px] border-0 text-white accordion-btn">
					<FaqIcon />
					<h3 className="text-normal font-medium text-white flex-grow text-left mx-2 w-0 font-urbanist">
						{item.title}
					</h3>
					<span className="text-white">{open === index ? "-" : "+"}</span>
				</Accordion.Header>
				<Accordion.Body className="px-4 border-t border-opacity-10 border-white">
					<p className="text-white font-urbanist text-sm">
						{item.content}
					</p>
				</Accordion.Body>
			</div>
		</Accordion>
	);
};

const data = [
	{
		id: 1,
		title: "What is Pulse Capital?",
		content:
			"Capital Farms is a decentralized application (dApp) that allows users to manage and monitor their portfolio. It provides data-driven insights to help users make informed decisions about their investments.",
	},
	{
		id: 2,
		title: "How can I participate in Pulse Capital?",
		content:
			"To get started with Capital Farms, you need to create an account on the platform. Once you have created an account, you can connect your wallet and start managing your assets and portfolio.",
	},
	{
		id: 3,
		title: "How does Pulse Capital work?",
		content:
			"Yes, Capital Farms is safe to use. The platform uses blockchain technology to secure user data and transactions. It also provides users with full control over their assets and portfolio.",
	},
	{
		id: 4,
		title: "What tokens are supported in Pulse Capital?",
		content:
			"If you have any questions or need assistance, you can contact Capital Farms support by sending an email to demo@gmail.com",
	},
	{
		id: 5,
		title: "What is Capital Farms?",
		content:
			"If you have any questions or need assistance, you can contact Capital Farms support by sending an email to",
	},
	{
		id: 6,
		title: "Are there fees associated with using Pulse Capital?",
		content:
			"If you have any questions or need assistance, you can contact Capital Farms support by sending an email to",
	},
	{
		id: 7,
		title: "What is the Heart Fund?",
		content:
			"If you have any questions or need assistance, you can contact Capital Farms support by sending an email to",
	},
	{
		id: 8,
		title: "How can I maximize my earnings in Pulse Capital?",
		content:
			"If you have any questions or need assistance, you can contact Capital Farms support by sending an email to",
	},
	{
		id: 9,
		title: "What is the STOCK Pool?",
		content:
			"If you have any questions or need assistance, you can contact Capital Farms support by sending an email to",
	},
	{
		id: 10,
		title: "Is Pulse Capital secure?",
		content:
			"If you have any questions or need assistance, you can contact Capital Farms support by sending an email to",
	},
];

export default Faqs;
