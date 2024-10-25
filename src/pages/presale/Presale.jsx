import React, {useState, useEffect} from "react";
import Faqs from "../../components/Faqs";
import Layout from "../../components/Layout";
import AmbassadorSection from "./components/AmbassadorSection";
import ClaimTokens from "./components/ClaimTokens";
import PageHeader from "./components/PageHeader";


import BigNumber from 'bignumber.js/bignumber'
import useInterval from "../../hooks/useInterval";
import contracts from "../../config/constants/contracts.js"
import { multicall, writeContract } from '@wagmi/core'
import { useAccount } from 'wagmi'
import lpABI from "../../config/abi/lpToken.json"

function toLocaleString(num, min, max, cutout) {
  const _number = isNaN(Number(num)) ? 0 : Number(num)
  if(cutout && num > 0 && num < cutout) return _number.toLocaleString(undefined, {minimumFractionDigits: max, maximumFractionDigits: max});
  else return _number.toLocaleString(undefined, {minimumFractionDigits: min, maximumFractionDigits: min});
}

BigNumber.config({
	EXPONENTIAL_AT: 1000,
	DECIMAL_PLACES: 18,
});

const PresaleSection = () => {
	const [connected, setConnected] = React.useState(false);
	const [userPoints, setUserPoints] = React.useState(0);
	const [totalPoints, setTotalPoints] = React.useState(0);
	const [daiBalance, setDaiBalance] = React.useState(0);
	const [approved, setApproved] = React.useState(0);

	const userAccount = useAccount({
		onConnect() {
			getStats()
			setConnected(true)
		},
		onDisconnect() {
			getStats()
			setConnected(false)
		},
	})

	async function approve() {
		const amount = daiBalance.mul(1e18).add(1);

		const { hash } = await writeContract({
			address: "0xefD766cCb38EaF1dfd701853BFCe31359239F305",
			abi: contracts.pair.abi,
			functionName: 'approve',
			account: userAccount.address,
			args: [contracts.presale.address, amount],
		})
		getStats();
	}

  	async function deposit(_id, _amount) {
		const amount = _amount*1e18;
		const { hash } = await writeContract({
     		...contracts.presale,
			functionName: 'Deposit',
			account: userAccount.address,
			args: [_id, amount],
		})
		getStats();
	}

	async function getStats() {
		/*
		const query = '0x554dcc3dFD807ef343855837A404bF4dF6D8C7Ee, 0xf808Bb6265e9Ca27002c0A04562Bf50d4FE37EAA' + ',' + farm.lpAddress; 
		const response = await fetch(`https://api.dexscreener.com/latest/dex/pairs/pulsechain/${query}`);
		const rsps = await response.json();
		
		const pinePrice = rsps.pairs.filter((pair)=>pair.pairAddress === '0x554dcc3dFD807ef343855837A404bF4dF6D8C7Ee')[0].priceUsd
    	const incPrice = rsps.pairs.filter((pair)=>pair.pairAddress === '0xf808Bb6265e9Ca27002c0A04562Bf50d4FE37EAA')[0].priceUsd
		const pairData = rsps.pairs.filter((pair)=>pair.pairAddress === farm.lpAddress)[0]
		*/
		const [_userPoints, _totalPoints, _daiBalance, _allowance] = await multicall({
			contracts: [
				{
					...contracts.presale,
					functionName: 'userPoints',
					args: [userAccount.address]
				},
				{
					...contracts.presale,
					functionName: 'totalPoints',
					args: []
				},
				{	
					address: "0xefD766cCb38EaF1dfd701853BFCe31359239F305",
					abi: contracts.pair.abi,
					functionName: 'balanceOf',
					args: [userAccount.address]
				},
				{	
					address: "0xefD766cCb38EaF1dfd701853BFCe31359239F305",
					abi: contracts.pair.abi,
					functionName: 'allowance',
					args: [userAccount.address, contracts.presale.address]
				},
			]
		});
		setUserPoints(new BigNumber(_userPoints.result).div(1e18))
		setTotalPoints(new BigNumber(_totalPoints.result).div(1e18))
		setDaiBalance(new BigNumber(_daiBalance.result).div(1e18))
		console.log()
		const _approved = new BigNumber(_allowance.result).greaterThan(new BigNumber(daiBalance).mul(1e18));
    
		setApproved(_approved);
	}
	return (
		<Layout shortFooter>
			<PageHeader miniFav="/img/mini-fav.png" userPoints={userPoints} totalPoints={totalPoints}/>
			<AmbassadorSection daiBalance={daiBalance} approved={approved} approve={approve} deposit={deposit}/>
			<ClaimTokens />
			<Faqs subHeading="Frequently Asked Questions" noGradient />
		</Layout>
	);
};

export default PresaleSection;
