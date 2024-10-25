import React, { useState, useEffect } from "react";
import dai from "../../../assets/img/token/dai.svg";
import inc from "../../../assets/img/token/inc.svg";
import pcap from "../../../assets/img/token/pcap.svg";
import pls from "../../../assets/img/token/pls.svg";
import plsx from "../../../assets/img/token/plsx.svg";
import usdc from "../../../assets/img/token/usdc.svg";
import usdt from "../../../assets/img/token/usdt.svg";
import weth from "../../../assets/img/token/weth.svg";

import CustomModal from "../../../components/CustomModal";
import Zapper from "../../../components/Zapper";
import CustomSelectTwo from "../../../components/CustomSelectTwo";
import {
  AngleDown,
  Calculator,
  ClearIcon,
  ExchangeBottomIcon,
  UrlIcon,
} from "../../../components/Icon";
import SelectModal from "../../../components/SelectModal";

import BigNumber from "bignumber.js/bignumber";
import useInterval from "../../../hooks/useInterval";
import contracts from "../../../config/constants/contracts.js";
import { multicall, writeContract, waitForTransaction } from "@wagmi/core";
import { useAccount } from "wagmi";
import lpABI from "../../../config/abi/lpToken.json";
import toast from "react-hot-toast";
import CustomToast from "../../../components/CustomToast.jsx";

function toLocaleString(num, min, max, cutout) {
  const _number = isNaN(Number(num)) ? 0 : Number(num);
  if (cutout && num > 0 && num < cutout)
    return _number.toLocaleString(undefined, {
      minimumFractionDigits: max,
      maximumFractionDigits: max,
    });
  else
    return _number.toLocaleString(undefined, {
      minimumFractionDigits: min,
      maximumFractionDigits: min,
    });
}

BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 18,
});

const CapitalFarmsCard = ({
  native,
  hideButtons,
  modalsOnly,
  objectToFilter,
  active,
  search,
  stakedOnly,
  index,
  dropdown,
  ...farm
}) => {
  /* 	const [staked, setStaked] = React.useState(false); */
  const [stakeNewModalOpen, setStakeNewModalOpen] = React.useState(false);
  const [lpdetailsOpen, setLpdetailsOpen] = React.useState(false);
  const [unstakeModalOpen, setUnStakeModalOpen] = React.useState(false);
  const [roiModalOpen, setRoiModalOpen] = React.useState(false);
  const [stakeModalOpen, setStakeModalOpen] = React.useState(false);
  const [zappedModalOpenFromHeader, setZappedModalOpenFromHeader] =
    React.useState(false);
  const [zapper, setZapper] = React.useState(0);
  const [activeDay, setActiveDay] = React.useState("25%");
  const [myStake, setMyStake] = React.useState("$100");
  const [dayStaked, setDayStaked] = React.useState("1DAY");
  const [selectedToken, setSelectedToken] = React.useState(0);

  // selectbox
  const [open, setOpen] = React.useState(false);
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [activeToken, setActiveToken] = React.useState(
    selectOptions[activeIndex]
  );

  const handleSelect = (index) => {
    setActiveIndex(index);
    setZappedModalOpenFromHeader(!zappedModalOpenFromHeader);
    setOpen(!open);
    if (index) {
      setActiveToken(selectOptions[index]);
    }
  };

  const [connected, setConnected] = React.useState(false);
  const [show, setShow] = React.useState(false);
  const [shakeModalShow, setShakeModalShow] = React.useState(null);
  const [detailsShow, setDetailsShow] = React.useState(false);
  const [staking, setStaking] = React.useState(false);
  const [approved, setApproved] = React.useState(false);
  const [farmFees, setFarmFees] = useState(0);
  const [multiplier, setMultiplier] = useState(0);
  const [pendingPine, setPendingPine] = useState(0);
  const [pendingPineUSD, setPendingPineUSD] = useState(0);
  const [totalLiquidity, setTotalLiquidity] = useState(0);
  const [stakedLpBalance, setStakedLpBalance] = useState(new BigNumber(0));
  const [stakedLpBalanceUSD, setStakedLpBalanceUSD] = useState(0);
  const [farmAPR, setFarmAPR] = useState(0);
  const [lpBalance, setLpBalance] = useState(new BigNumber(0));
  const [lpPrice, setLpPrice] = useState(0);
  const [masterLpBalance, setMasterLpBalance] = useState(0);
  const [stakeInput, setStakeInput] = useState(new BigNumber(0));
  const [unstakeInput, setUnstakeInput] = useState(new BigNumber(0));
  const [oneThousandDollarsWorthOfPine, setOneThousandDollarsWorthOfPine] =
    useState(0);
  const [farmROI, setFarmROI] = useState(0);
  const [lpSupply, setLpSupply] = useState(0);
  const [reserver, setReserves] = useState(0);
  const [pcapPrice, setPcapPrice] = useState(0);
  const [apr, setApr] = useState(0);
  const [calculatorAmountInput, setCalculatorAmountInput] = useState(0);

  const [token1, token2] = [
    farm?.lpSymbol?.split("-")[0] + ".png",
    farm?.lpSymbol?.split("-")[1] + ".png",
  ];
  const lpLink = `https://app.pulsex.com/add/V${farm.version}/${farm.quoteToken?.address}/${farm.token?.address}`;
  const scanLink = `https://scan.pulsechain.com/address/${farm.lpAddress}`;

  const userAccount = useAccount({
    onConnect() {
      getStats();
      setConnected(true);
    },
    onDisconnect() {
      getStats();
      setConnected(false);
    },
  });

  function getFarmApy(poolWeight, pinePrice, poolLiquidityUsd, PINE_PER_BLOCK) {
    const PLS_BLOCK_TIME = 11;
    const BLOCKS_PER_YEAR = (60 / PLS_BLOCK_TIME) * 60 * 24 * 365;
    const yearlyPineRewardAllocation =
      PINE_PER_BLOCK * BLOCKS_PER_YEAR * poolWeight * 0.95;
    const apy =
      ((yearlyPineRewardAllocation * pinePrice) / poolLiquidityUsd) * 100;
    return apy;
  }
  function getDailyROI(
    poolWeight,
    pinePrice,
    poolLiquidityUsd,
    PINE_PER_BLOCK
  ) {
    const PLS_BLOCK_TIME = 11;
    const BLOCKS_PER_YEAR = (60 / PLS_BLOCK_TIME) * 60 * 24;
    const dailyPineRewardAllocation =
      PINE_PER_BLOCK * BLOCKS_PER_YEAR * poolWeight * 0.9;
    const apy =
      ((dailyPineRewardAllocation * pinePrice) / poolLiquidityUsd) * 100;
    return apy;
  }
  async function getStats() {
    const query =
      "0x554dcc3dFD807ef343855837A404bF4dF6D8C7Ee" + "," + farm.lpAddress;
    const response = await fetch(
      `https://api.dexscreener.com/latest/dex/pairs/pulsechain/${query}`
    );
    const rsps = await response.json();

    const pinePrice = rsps.pairs?.filter(
      (pair) =>
        pair.pairAddress === "0x554dcc3dFD807ef343855837A404bF4dF6D8C7Ee"
    )[0]?.priceUsd;
    const pairData = rsps.pairs?.filter(
      (pair) => pair.pairAddress === farm.lpAddress
    )[0];

    const [
      poolInfo,
      allowance,
      pendingAtropine,
      _lpSupply,
      masterchefLpBalance,
      userLpBalance,
      userStakedLp,
      totalAllocPoint,
      pinePerBlock,
      farmLpBalance,
      _reserves,
    ] = await multicall({
      contracts: [
        {
          ...contracts.masterChef,
          functionName: "poolInfo",
          args: [farm.pid],
        },
        {
          address: farm.lpAddress,
          abi: lpABI,
          functionName: "allowance",
          args: [userAccount.address, contracts.masterChef.address],
        },
        {
          ...contracts.masterChef,
          functionName: "pendingPcap",
          args: [farm.pid, userAccount.address],
        },
        {
          address: farm.lpAddress,
          abi: lpABI,
          functionName: "totalSupply",
        },
        {
          address: "0xB2Ca4A66d3e57a5a9A12043B6bAD28249fE302d4",
          abi: contracts.masterChef.abi,
          functionName: "userInfo",
          args: [farm.plsxPid, contracts.masterChef.address],
        },
        {
          address: farm.lpAddress,
          abi: lpABI,
          functionName: "balanceOf",
          args: [userAccount.address],
        },
        {
          ...contracts.masterChef,
          functionName: "userInfo",
          args: [farm.pid, userAccount.address],
        },
        {
          ...contracts.masterChef,
          functionName: "totalAllocPoint",
        },
        {
          ...contracts.masterChef,
          functionName: "PcapPerBlock",
        },
        {
          address: farm.lpAddress,
          abi: lpABI,
          functionName: "balanceOf",
          args: [contracts.masterChef.address],
        },
        {
          address: farm.lpAddress,
          abi: lpABI,
          functionName: "getReserves",
        },
      ],
    });

    if (poolInfo.result) {
      setLpSupply(Number(_lpSupply.result));
      setReserves(_reserves.result);
      console.log(reserver[0]);
      const _lpPrice =
        Number(pairData?.liquidity.usd) / (Number(_lpSupply.result) / 1e18);
      setLpPrice(_lpPrice);
      console.log(pairData?.liquidity.usd, "LPPRICE");
      const _poolWeight =
        Number(poolInfo.result[1]) / Number(totalAllocPoint.result);

      const _farmFees =
        Number(poolInfo.result[4]) > 0
          ? Number(poolInfo.result[4]) / 10000 + "% fees"
          : "No Fees";

      setFarmFees(_farmFees);
      const _multiplier = Number(poolInfo.result[1]) / 10 + "x";
      setMultiplier(_multiplier);

      const _pendingPine = Number(
        Number(pendingAtropine.result ? pendingAtropine.result : 0) / 1e18
      ).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
      setPendingPine(_pendingPine);
      console.log(pendingAtropine, "pending");
      const _pendingPineUSD = Number(
        (Number(pendingAtropine.result ? pendingAtropine.result : 0) / 1e18) *
          pinePrice
      ).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
      setPendingPineUSD(_pendingPineUSD);

      const _masterLpBalance =
        Number(poolInfo.result[7]) == 1
          ? farmLpBalance.result
          : masterchefLpBalance.result[0];
      setMasterLpBalance(Number(_masterLpBalance));
      const _totalLiquidity = Number(
        _lpPrice * (Number(masterLpBalance) / 1e18)
      ).toLocaleString(undefined, { maximumFractionDigits: 0 });
      setTotalLiquidity(_totalLiquidity);

      const _stakedLpBalance = new BigNumber(
        userStakedLp.result ? userStakedLp.result[0] : 0
      ).div(1e18);
      setStakedLpBalance(_stakedLpBalance);
      const _staking =
        Number(
          Number(userStakedLp.result ? userStakedLp.result[0] : 0) / 1e18
        ) > 0;
      setStaking(_staking);
      const _stakedLpBalanceUSD = Number(
        (Number(userStakedLp.result ? userStakedLp.result[0] : 0) / 1e18) *
          _lpPrice
      ).toLocaleString(undefined, {
        minimumFractionDigits: 3,
        maximumFractionDigits: 3,
      });
      setStakedLpBalanceUSD(_stakedLpBalanceUSD);
      const _farmAPR = Number(
        getFarmApy(
          _poolWeight,
          pinePrice,
          Number(_lpPrice * (Number(masterLpBalance) / 1e18)),
          Number(pinePerBlock.result) / 1e18
        )
      ).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
      setFarmAPR(_farmAPR);
      const _farmROI = Number(
        getDailyROI(
          _poolWeight,
          pinePrice,
          Number(_lpPrice * (Number(masterLpBalance) / 1e18)),
          Number(pinePerBlock.result) / 1e18
        )
      ).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
      setFarmROI(_farmROI);
      const _lpBalance = new BigNumber(
        userLpBalance.result ? userLpBalance.result : 0
      ).div(1e18);
      setLpBalance(_lpBalance);

      const _approved = new BigNumber(allowance.result).greaterThan(
        _lpBalance.mul(1e18)
      );

      setApproved(_approved);

      objectToFilter(farm.lpAddress, {
        pendingPine: Number(pendingAtropine.result) / 1e18,
        totalLiquidity:
          (Number(pairData?.liquidity.usd) /
            (Number(_lpSupply.result) / 1e18)) *
          (Number(masterLpBalance) / 1e18),
        farmAPR: getFarmApy(
          _poolWeight,
          pinePrice,
          Number(_lpPrice * (Number(masterLpBalance) / 1e18)),
          Number(pinePerBlock.result) / 1e18
        ),
      });

      const _apr = Number(
        getFarmApy(
          _poolWeight,
          pinePrice,
          Number(_lpPrice * (Number(masterLpBalance) / 1e18)),
          Number(pinePerBlock.result) / 1e18
        )
      );
      setApr(_apr);
      setPcapPrice(pinePrice);

      const _oneThousandDollarsWorthOfPine = 1000 / pinePrice;
      setOneThousandDollarsWorthOfPine(_oneThousandDollarsWorthOfPine);
    }
  }

  useEffect(() => {
    getStats();
  }, [active]);

  useInterval(async () => {
    await getStats();
  }, 15000);

  async function approve() {
    try {
      const amount = lpBalance.mul(1e18).add(1);
      toast.custom((t) => (
        <CustomToast
          toast={toast}
          t={t}
          type={"pending"}
          description={"Awaiting for approval..."}
        />
      ));
      const { hash } = await writeContract({
        address: farm.lpAddress,
        abi: lpABI,
        functionName: "approve",
        account: userAccount.address,
        args: [contracts.masterChef.address, amount],
      });
      toast.custom((t) => (
        <CustomToast
          toast={toast}
          t={t}
          type={"submit"}
          description={"Transaction Submitted!"}
          hash={hash}
        />
      ));
      await waitForTransaction({
        hash,
      });
      toast.custom((t) => (
        <CustomToast
          toast={toast}
          t={t}
          type={"confirmed"}
          title={`${farm.lpSymbol} Contract Approved`}
          description={<></>}
          hash={hash}
        />
      ));
      getStats();
    } catch (error) {
      toast.custom((t) => <CustomToast toast={toast} t={t} type={"failed"} />);
    }
  }

  async function harvest() {
    try {
      toast.custom((t) => (
        <CustomToast
          toast={toast}
          t={t}
          type={"pending"}
          description={"Awaiting for approval..."}
        />
      ));
      const { hash } = await writeContract({
        ...contracts.masterChef,
        functionName: "deposit",
        account: userAccount.address,
        args: [farm.pid, 0],
      });
      toast.custom((t) => (
        <CustomToast
          toast={toast}
          t={t}
          type={"submit"}
          description={"Transaction Submitted!"}
          hash={hash}
        />
      ));
      await waitForTransaction({
        hash,
      });
      toast.custom((t) => (
        <CustomToast
          toast={toast}
          t={t}
          type={"confirmed"}
          title={`CLAIMED!`}
          description={
            <div className="font-[500] leading-[17px] text-[16px] mt-2">
              Your Rewards have been sent to your wallet!
            </div>
          }
          hash={hash}
        />
      ));
      getStats();
    } catch (error) {
      toast.custom((t) => <CustomToast toast={toast} t={t} type={"failed"} />);
    }
  }

  async function stake() {
    try {
      const _value = new BigNumber(stakeInput.toString())
        .mul(1e18)
        .toString()
        .split(".")[0];
      toast.custom((t) => (
        <CustomToast
          toast={toast}
          t={t}
          type={"pending"}
          description={"Awaiting for approval..."}
        />
      ));
      const { hash } = await writeContract({
        ...contracts.masterChef,
        functionName: "deposit",
        account: userAccount.address,
        args: [farm.pid, _value],
      });
      toast.custom((t) => (
        <CustomToast
          toast={toast}
          t={t}
          type={"submit"}
          description={"Transaction Submitted!"}
          hash={hash}
        />
      ));
      await waitForTransaction({
        hash,
      });
      toast.custom((t) => (
        <CustomToast
          toast={toast}
          t={t}
          type={"confirmed"}
          title={`STAKED!`}
          description={
            <div className="font-[500] leading-[17px] text-[16px] mt-2">
              Your funds have been Staked!
            </div>
          }
          hash={hash}
        />
      ));
      getStats();
    } catch (error) {
      toast.custom((t) => <CustomToast toast={toast} t={t} type={"failed"} />);
    }
  }

  async function unstake() {
    try {
      const _value = new BigNumber(unstakeInput.toString())
        .mul(1e18)
        .toString()
        .split(".")[0];
      toast.custom((t) => (
        <CustomToast
          toast={toast}
          t={t}
          type={"pending"}
          description={"Awaiting for approval..."}
        />
      ));
      const { hash } = await writeContract({
        ...contracts.masterChef,
        functionName: "withdraw",
        account: userAccount.address,
        args: [farm.pid, _value],
      });
      toast.custom((t) => (
        <CustomToast
          toast={toast}
          t={t}
          type={"submit"}
          description={"Transaction Submitted!"}
          hash={hash}
        />
      ));
      await waitForTransaction({
        hash,
      });
      toast.custom((t) => (
        <CustomToast
          toast={toast}
          t={t}
          type={"confirmed"}
          title={`UNSTAKED!`}
          description={
            <div className="font-[500] leading-[17px] text-[16px] mt-2">
              Your funds have been Unstaked!
            </div>
          }
          hash={hash}
        />
      ));
      getStats();
    } catch (error) {
      toast.custom((t) => <CustomToast toast={toast} t={t} type={"failed"} />);
    }
  }

  async function setMaxStakeInput() {
    setStakeInput(lpBalance);
  }

  async function setMaxUnstakeInput() {
    setUnstakeInput(stakedLpBalance);
  }

  function roundToTwoDp(number) {
    return Math.round(number * 100) / 100;
  }

  function calculateReturnPerDolar(numberOfDays, farmApy, pinePrice) {
    // Everything here is worked out relative to a year, with the asset compounding daily
    const timesCompounded = 365;
    //   We use decimal values rather than % in the math for both APY and the number of days being calculates as a proportion of the year
    const apyAsDecimal = farmApy / 100;
    const daysAsDecimalOfYear = numberOfDays / timesCompounded;
    //   Calculate the starting CAKE balance with a dollar balance of $1000.
    const principal = 1 / pinePrice;

    // This is a translation of the typical mathematical compounding APY formula. Details here: https://www.calculatorsoup.com/calculators/financial/compound-interest-calculator.php
    const finalAmount =
      principal *
      (1 + apyAsDecimal / timesCompounded) **
        (timesCompounded * daysAsDecimalOfYear);

    // To get the pine earned, deduct the amount after compounding (finalAmount) from the starting CAKE balance (principal)
    const interestEarned = finalAmount - principal;
    return finalAmount;
  }

  if (active !== farm.farmActive) return <></>;
  if (
    search !== "" &&
    !farm.lpSymbol?.toLowerCase().includes(search.toLowerCase())
  )
    return <></>;
  if (
    stakedOnly &&
    pendingPine ===
      Number(0).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
  )
    return <></>;

  return (
    <>
      {modalsOnly ? (
        ""
      ) : (
        <div
          className={`bg-gradient9 p-[1px] shadow-cardShadow rounded-t-[10px] ${
            !approved ? "rounded-b-[10px]" : "rounded-[10px]"
          }`}
        >
          <div className="bg-[#1C0050] rounded-[10px]">
            <div className="py-4 px-4 sm:px-6 flex justify-between items-center bg-gradient11 rounded-t-[10px]">
              <div>
                <h3 className="flex items-center mb-2">
                  <span className="mr-1 text-xl sm:text-2xl font-bold">
                    {farm.lpSymbol}
                  </span>
                  <button type="button">
                    <UrlIcon />
                  </button>{" "}
                </h3>
                <div className="flex flex-wrap gap-[2px] items-center">
                  <span className="font-medium">Earn PCAP</span>
                  <span className="text-sm font-semibold text-[#1F1E19] leading-[24px] px-2 rounded-[5px] bg-gradient12 mr-[6px]">
                    {multiplier}
                  </span>
                  {native ? (
                    <span className="text-sm font-semibold text-[#011336] leading-[24px] px-2 rounded-[5px] bg-menuHover mr-[6px]">
                      Native
                    </span>
                  ) : (
                    <img
                      src="/img/capital/pulse-x.svg"
                      className="mr-[6px]"
                      alt=""
                    />
                  )}
                  <span className="p-[1px] rounded-[5px] bg-gradient-to-b from-[#5D35A5] to-[#5D35A500] flex">
                    <span className="text-sm font-bold text-white leading-[24px] px-2 rounded-[5px] bg-[#150238]">
                      v2
                    </span>
                  </span>
                </div>
              </div>
              <div className="flex gap-1">
                <img
                  src={"./img/tokens/" + token1}
                  className="w-8 sm:w-[50px]"
                  alt=""
                />
                <img
                  src={"./img/tokens/" + token2}
                  className="w-8 sm:w-[50px]"
                  alt=""
                />
              </div>
            </div>
            <div className="px-3 py-4 sm:text-md">
              <div className="p-[1px] rounded-[10px] bg-gradient9">
                <div className="bg-[#150238] rounded-[10px] py-3 px-[14px]">
                  <div className="flex items-center justify-between">
                    <span>APY:</span>
                    <span className="font-bold flex items-center">
                      <button
                        type="button"
                        className="mr-[2px]"
                        onClick={() => setRoiModalOpen(true)}
                      >
                        <Calculator />
                      </button>{" "}
                      {farmAPR}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>
                      Daily <span className="text-gradient-3">APR</span>:
                    </span>
                    <span className="font-bold text-gradient-3">
                      {farmROI}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>
                      Deposit <span className="text-blue">Fee:</span>
                    </span>
                    <span className="font-bold text-blue">{farmFees}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>
                      Total Value Locked{" "}
                      <button type="button">
                        <UrlIcon />
                      </button>
                    </span>
                    <span className="text-white text-opacity-50">
                      ${totalLiquidity}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap justify-between mt-4">
                <div className="w-[calc(50%-5px)]">
                  <div className="dashboard-card w-full max-w-full group">
                    <div className="__border" />
                    <div className="relative z-10">
                      <div className="-mb-2">
                        <h6 className="text-xs sm:text-normal font-semibold -translate-y-1/2 mx-4 m-0 text-opacity-50 text-white inline-flex items-center gap-1 bg-[#1C0050] px-2">
                          <span className="group-hover:text-gradient-3">
                            Staked LP{" "}
                          </span>
                          <button
                            type="button"
                            onClick={() => setLpdetailsOpen(true)}
                          >
                            <UrlIcon />
                          </button>
                        </h6>
                      </div>
                      <div className="bg-gradient9 rounded-[5px] p-[1px]">
                        <div className="bg-[#150238] shadow-innerShadow rounded-[5px]">
                          <h2 className="text-lg font-semibold pt-3 pb-2">
                            {toLocaleString(stakedLpBalance, 2, 6, 0.1)}
                          </h2>
                          <p className="text-sm text-white text-opacity-50 pb-[2px] border-t border-white border-opacity-20">
                            ${toLocaleString(stakedLpBalanceUSD, 2, 2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-[calc(50%-5px)]">
                  <div className="dashboard-card w-full max-w-full group">
                    <div className="__border border-white border-opacity-50" />
                    <div className="relative z-10">
                      <div className="-mb-2">
                        <h6 className="text-xs sm:text-normal font-semibold -translate-y-1/2 mx-4 m-0 text-opacity-50 text-white inline-flex items-center gap-1 bg-[#1C0050] px-2">
                          <span className="group-hover:text-gradient-3 text-gradient-3">
                            PCAP Earned
                          </span>
                        </h6>
                      </div>
                      <div className="bg-gradient9 rounded-[5px] p-[1px]">
                        <div className="bg-[#150238] shadow-innerShadow rounded-[5px]">
                          <h2 className="text-lg font-semibold pt-3 pb-2">
                            {pendingPine}
                          </h2>
                          <p className="text-sm text-white text-opacity-50 pb-[2px] border-t border-white border-opacity-20">
                            ${pendingPineUSD}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {!hideButtons ? (
              !approved && Number(stakedLpBalance) === 0 ? (
                <button
                  type="button"
                  className="btn-3 w-full text-md sm:text-lg h-[58px] rounded-b-[10px] rounded-t-none"
                  onClick={() => approve()}
                >
                  Approve
                </button>
              ) : (
                <div className="flex">
                  {!approved ? (
                    <button
                      type="button"
                      className="btn-3 w-full text-md sm:text-lg h-[58px] rounded-bl-[10px] rounded-t-none"
                      onClick={() => approve()}
                    >
                      Approve
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="btn-3 w-full text-md sm:text-lg h-[58px] rounded-bl-[10px] rounded-none bg-whiteGradient hover:bg-whiteGradient"
                      onClick={() => setStakeModalOpen(!stakeModalOpen)}
                    >
                      Stake
                    </button>
                  )}
                  <button
                    type="button"
                    className="btn-3 w-full text-md sm:text-lg h-[58px] rounded-none bg-unstakeGradient hover:bg-unstakeGradient text-white"
                    onClick={() => setUnStakeModalOpen(!unstakeModalOpen)}
                  >
                    Unstake
                  </button>
                  <button
                    type="button"
                    className="btn-3 w-full text-md sm:text-lg h-[58px] rounded-br-[10px] rounded-none bg-menuHover hover:bg-menuHover"
                    onClick={harvest}
                  >
                    Claim
                  </button>
                </div>
              )
            ) : (
              ""
            )}
          </div>
        </div>
      )}
      {/* Lp Details Modal */}
      <CustomModal
        open={lpdetailsOpen}
        setOpen={setLpdetailsOpen}
        onlyChildren={true}
      >
        <div className="relative z-10 m-auto max-w-[350px] bg-gradient9 rounded-[10px] p-[1px] overflow-hidden fadeInUp">
          <div className="bg-[#33026D] rounded-[10px]">
            <div className="bg-lpDetailsGradient absolute -bottom-full left-0 w-full h-full blur-[75px]" />
            <div className="relative z-10">
              <div className="flex justify-between items-start py-4 px-6 rounded-t-[10px]  bg-[#150238]">
                <div className="text-lg">
                  <span className="text-gradient-3">PCAP-BNB </span>{" "}
                  <span>LP Staked</span>
                </div>
                <button type="button" onClick={() => setLpdetailsOpen(false)}>
                  <ClearIcon />
                </button>
              </div>
              <div className="py-5 px-6">
                <div className="bg-[#150238] rounded-[10px] px-[14px] font-medium">
                  <div className="flex items-center justify-between pb-[5px] pt-[11px]">
                    <span>Your % share of TVL</span>
                    <span className="text-blue">
                      {toLocaleString(
                        (Number(stakedLpBalance) /
                          (Number(masterLpBalance) / 1e18)) *
                          100,
                        2,
                        6,
                        0.01
                      )}
                      %
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-t border-white border-opacity-20 pt-[5px] pb-[11px]">
                    <span>
                      {toLocaleString(
                        Number(masterLpBalance) / 1e18,
                        2,
                        6,
                        0.01
                      )}{" "}
                      LP
                    </span>
                    <span className="text-blue">
                      $
                      {toLocaleString(
                        (Number(masterLpBalance) / 1e18) * lpPrice,
                        2,
                        2
                      )}
                    </span>
                  </div>
                </div>
                <div className="bg-[#150238] rounded-[10px] px-[14px] font-medium mt-[15px]">
                  <div className="flex items-center justify-between pb-[5px] pt-[11px] font-semibold">
                    <span>
                      <span className="text-gradient-3">Staked LP</span> Details
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-t border-white border-opacity-20 pt-[6px]">
                    <span>
                      {toLocaleString(
                        ((Number(masterLpBalance) / lpSupply) *
                          Number(reserver[0])) /
                          10 ** farm.token.decimals,
                        2,
                        2
                      )}{" "}
                      <span className="text-blue">{farm.token.symbol}</span>
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-[5px] pb-3">
                    <span>
                      {toLocaleString(
                        ((Number(masterLpBalance) / lpSupply) *
                          Number(reserver[1])) /
                          10 ** farm.quoteToken.decimals,
                        2,
                        2
                      )}{" "}
                      <span className="text-blue">
                        {farm.quoteToken.symbol}
                      </span>{" "}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CustomModal>
      {/* Unstake Modal */}
      <CustomModal
        open={unstakeModalOpen}
        setOpen={setUnStakeModalOpen}
        onlyChildren={true}
      >
        <div className="w-full max-w-[480px] m-auto fadeInUp">
          <div className="asset-card h-full">
            <div className="inner">
              <img
                src="/img/asset-card-shape.png"
                className="absolute top-0 right-0 w-full rounded-[10px] blur-[75px]"
                alt=""
              />
              <div className="pb-6 pt-4 md:pb-7 h-full relative z-[11]">
                <div className="flex justify-between items-start pb-2 px-6 rounded-t-[10px] font-semibold">
                  <div className="text-lg"></div>
                  <button
                    type="button"
                    onClick={() => setUnStakeModalOpen(false)}
                  >
                    <ClearIcon />
                  </button>
                </div>
                <h5 className="text-md sm:text-lg font-semibold flex items-center gap-5 flex-grow mb-8 px-4 xl:pl-[30px] pr-0">
                  <div>Unstake Tokens</div>
                  <span className="w-0 flex-grow bg-gradient8 h-[1px]"></span>
                </h5>
                <div className="px-4 xl:px-[30px] gap-5 md:gap-[27px] md:gap-y-[17px]">
                  <div className="text-sm font-semibold mb-4 xl:text-right xl:pr-6">
                    Unstake your tokens
                  </div>
                  <div className="asset-card">
                    <div className="rounded-[10px] bg-[#140236] text-center h-full">
                      <div className="flex justify-between items-center">
                        <div className="pt-4 pb-2 px-[14px] w-0 flex-grow">
                          <input
                            type="number"
                            className="w-full text-md sm:text-lg font-semibold bg-transparent border-0 outline-none text-left text-white placeholder:text-white"
                            placeholder="0.0"
                            value={unstakeInput}
                            onChange={(e) => setUnstakeInput(e.target.value)}
                          />
                          <div className="text-white text-opacity-50 text-sm font-medium text-left">
                            ${toLocaleString(unstakeInput * lpPrice)}
                          </div>
                        </div>
                        <div className="text-md sm:text-lg font-semibold pr-5">
                          {farm.lpSymbol} LP
                        </div>
                      </div>
                      <div
                        className="text-sm text-white text-opacity-30 border-t border-white border-opacity-20 py-1 mx-[14px] flex justify-between font-medium"
                        onClick={() => {
                          setUnstakeInput(stakedLpBalance);
                        }}
                      >
                        <span>{farm.lpSymbol} Available:</span>
                        <span>
                          {toLocaleString(stakedLpBalance, 2, 6, 0.1)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="my-[15px] flex justify-center flex-wrap gap-1 items-center">
                    <button
                      className={`day-btn font-semibold ${
                        activeDay === "25%"
                          ? "bg-whiteGradient text-[#150238]"
                          : ""
                      }`}
                      onClick={() => {
                        setActiveDay("25%");
                        setUnstakeInput(stakedLpBalance / 4);
                      }}
                      type="button"
                    >
                      25%
                    </button>
                    <button
                      className={`day-btn font-semibold ${
                        activeDay === "50%"
                          ? "bg-whiteGradient text-[#150238]"
                          : ""
                      }`}
                      onClick={() => {
                        setActiveDay("50%");
                        setUnstakeInput(stakedLpBalance / 2);
                      }}
                      type="button"
                    >
                      50%
                    </button>
                    <button
                      className={`day-btn font-semibold ${
                        activeDay === "75%"
                          ? "bg-whiteGradient text-[#150238]"
                          : ""
                      }`}
                      onClick={() => {
                        setActiveDay("75%");
                        setUnstakeInput((stakedLpBalance / 4) * 3);
                      }}
                      type="button"
                    >
                      75%
                    </button>
                    <button
                      className={`day-btn font-semibold ${
                        activeDay === "MAX"
                          ? "bg-whiteGradient text-[#150238]"
                          : ""
                      }`}
                      onClick={() => {
                        setActiveDay("MAX");
                        setUnstakeInput(stakedLpBalance);
                      }}
                      type="button"
                    >
                      MAX
                    </button>
                  </div>
                  <div className="flex justify-evenly">
                    <button
                      type="button"
                      className="h-[45px] sm:font-bold mt-[15px] px-4 sm:w-full max-w-[142px] bg-transparent text-white text-opacity-50 rounded-[5px] border border-white border-opacity-50"
                      onClick={() => setUnStakeModalOpen(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="btn-3 h-[45px] sm:font-bold mt-[15px] px-4 sm:w-full max-w-[142px] bg-menuHover"
                      onClick={() => {
                        /* setStaked(false); */
                        setUnStakeModalOpen(false);
                        unstake();
                      }}
                    >
                      Unstake
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CustomModal>
      {/* Unstake Modal */}
      <CustomModal
        open={stakeNewModalOpen}
        setOpen={setStakeNewModalOpen}
        onlyChildren={true}
      >
        <div className="w-full max-w-[480px] m-auto fadeInUp">
          <div className="asset-card h-full">
            <div className="inner">
              <img
                src="/img/asset-card-shape.png"
                className="absolute top-0 right-0 w-full rounded-[10px] blur-[75px]"
                alt=""
              />
              <div className="pb-6 pt-4 md:pb-7 h-full relative z-[11]">
                <div className="flex justify-between items-start pb-2 px-6 rounded-t-[10px] font-semibold">
                  <div className="text-lg"></div>
                  <button
                    type="button"
                    onClick={() => setStakeNewModalOpen(false)}
                  >
                    <ClearIcon />
                  </button>
                </div>
                <h5 className="text-md sm:text-lg font-semibold flex items-center gap-5 flex-grow mb-8 px-4 xl:pl-[30px] pr-0">
                  <div>Stake Tokens</div>
                  <span className="w-0 flex-grow bg-gradient8 h-[1px]"></span>
                </h5>
                <div className="px-4 xl:px-[30px] gap-5 md:gap-[27px] md:gap-y-[17px]">
                  <div className="text-sm font-semibold mb-4 xl:text-right xl:pr-6">
                    Stake your tokens
                  </div>
                  <div className="asset-card">
                    <div className="rounded-[10px] bg-[#140236] text-center h-full">
                      <div className="flex justify-between items-center">
                        <div className="pt-4 pb-2 px-[14px] w-0 flex-grow">
                          <input
                            type="number"
                            className="w-full text-md sm:text-lg font-semibold bg-transparent border-0 outline-none text-left text-white placeholder:text-white"
                            placeholder="0.0"
                            value={stakeInput}
                            onChange={(e) => setStakeInput(e.target.value)}
                          />
                          <div className="text-white text-opacity-50 text-sm font-medium text-left">
                            ${toLocaleString(stakeInput * lpPrice)}
                          </div>
                        </div>
                        <div className="text-md sm:text-lg font-semibold pr-5">
                          {farm.lpSymbol} LP
                        </div>
                      </div>
                      <div className="text-sm text-white text-opacity-30 border-t border-white border-opacity-20 py-1 mx-[14px] flex justify-between font-medium">
                        <span>{farm.lpSymbol} Available:</span>
                        <span>{toLocaleString(lpBalance, 2, 6, 0.1)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="my-[15px] flex justify-center flex-wrap gap-1 items-center">
                    <button
                      className={`day-btn font-semibold ${
                        activeDay === "25%"
                          ? "bg-whiteGradient text-[#150238]"
                          : ""
                      }`}
                      onClick={() => {
                        setActiveDay("25%");
                        setStakeInput(lpBalance / 4);
                      }}
                      type="button"
                    >
                      25%
                    </button>
                    <button
                      className={`day-btn font-semibold ${
                        activeDay === "50%"
                          ? "bg-whiteGradient text-[#150238]"
                          : ""
                      }`}
                      onClick={() => {
                        setActiveDay("50%");
                        setStakeInput(lpBalance / 2);
                      }}
                      type="button"
                    >
                      50%
                    </button>
                    <button
                      className={`day-btn font-semibold ${
                        activeDay === "75%"
                          ? "bg-whiteGradient text-[#150238]"
                          : ""
                      }`}
                      onClick={() => {
                        setActiveDay("75%");
                        setStakeInput((lpBalance / 4) * 3);
                      }}
                      type="button"
                    >
                      75%
                    </button>
                    <button
                      className={`day-btn font-semibold ${
                        activeDay === "MAX"
                          ? "bg-whiteGradient text-[#150238]"
                          : ""
                      }`}
                      onClick={() => {
                        setActiveDay("MAX");
                        setStakeInput(lpBalance);
                      }}
                      type="button"
                    >
                      MAX
                    </button>
                  </div>
                  <div className="flex justify-evenly">
                    <button
                      type="button"
                      className="h-[45px] sm:font-bold mt-[15px] px-4 sm:w-full max-w-[142px] bg-transparent text-white text-opacity-50 rounded-[5px] border border-white border-opacity-50"
                      onClick={() => setStakeNewModalOpen(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="btn-3 h-[45px] sm:font-bold mt-[15px] px-4 sm:w-full max-w-[142px] bg-menuHover"
                      onClick={() => {
                        /* setStaked(false); */
                        setStakeNewModalOpen(false);
                        stake();
                      }}
                    >
                      Stake
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CustomModal>
      {/* ROI Calculator Modal */}
      <CustomModal
        open={roiModalOpen}
        setOpen={setRoiModalOpen}
        onlyChildren={true}
      >
        <div className="w-full max-w-[530px] m-auto fadeInUp">
          <div className="asset-card h-full">
            <div className="inner" style={{ background: "#070115" }}>
              <img
                src="/img/capital/roi-bg.png"
                className="absolute top-0 right-0 w-full rounded-[10px] blur-[75px]"
                alt=""
              />
              <div className="py-6 md:py-7 h-full relative z-[11]  px-4 xl:px-[30px]">
                <h5 className="text-md flex-wrap justify-between sm:text-lg font-semibold flex items-center gap-3 flex-grow mb-5">
                  <div>ROI Calculator</div>
                  <button
                    type="button"
                    onClick={() => setRoiModalOpen(false)}
                    className="w-6"
                  >
                    <ClearIcon />
                  </button>
                  <span className="w-full flex-grow bg-gradient8 h-[1px]"></span>
                </h5>
                <div className="text-center text-md mb-4">{farm.lpSymbol}</div>

                <div className="asset-card">
                  <div className="rounded-[10px] bg-[#140236] text-center h-full">
                    <div className="flex justify-between items-center">
                      <div className="pt-4 pb-2 px-[14px] w-0 flex-grow">
                        <input
                          type="number"
                          className="w-full text-md sm:text-lg font-medium bg-transparent border-0 outline-none text-left text-white placeholder:text-white placeholder:text-opacity-50"
                          placeholder="Enter $ Amount..."
                          value={calculatorAmountInput}
                          onChange={(e) =>
                            setCalculatorAmountInput(e.target.value)
                          }
                        />
                        <div className="text-white text-opacity-50 text-sm font-semibold text-left">
                          0 {farm.lpSymbol} LP
                        </div>
                      </div>
                      <div className="text-md sm:text-lg font-semibold pr-5">
                        {farm.lpSymbol} LP
                      </div>
                    </div>
                    <div className="text-sm text-white text-opacity-30 border-t border-white border-opacity-20 py-1 mx-[14px] flex justify-between font-medium">
                      <span></span>
                      <span>My Stake: 154,622.44 LP</span>
                    </div>
                  </div>
                </div>
                <div className="my-[15px] flex justify-center flex-wrap gap-1 items-center">
                  <button
                    className={`day-btn font-semibold min-w-[80px] sm:min-w-[100px] ${
                      calculatorAmountInput === "$100"
                        ? "bg-whiteGradient text-[#150238]"
                        : ""
                    }`}
                    onClick={() => setCalculatorAmountInput("100")}
                    type="button"
                  >
                    $100
                  </button>
                  <button
                    className={`day-btn font-semibold min-w-[80px] sm:min-w-[100px] ${
                      calculatorAmountInput === "$1000"
                        ? "bg-whiteGradient text-[#150238]"
                        : ""
                    }`}
                    onClick={() => setCalculatorAmountInput("1000")}
                    type="button"
                  >
                    $1000
                  </button>
                  <button
                    className={`day-btn font-semibold min-w-[80px] sm:min-w-[100px] ${
                      calculatorAmountInput === stakedLpBalanceUSD
                        ? "bg-whiteGradient text-[#150238]"
                        : ""
                    }`}
                    onClick={() => setCalculatorAmountInput(stakedLpBalanceUSD)}
                    type="button"
                  >
                    My Stake
                  </button>
                </div>
                <div className="mt-6 text-center">
                  <span className="text-white text-opacity-50 text-md mb-2">
                    Staked For
                  </span>
                  <div className="bg-gradient9 p-[1px] rounded-[5px] max-w-[400px] mx-auto">
                    <div className="flex flex-wrap items-center bg-[#150238]  rounded-[5px] relative z-10">
                      <button
                        type="button"
                        className={`staked-day-btn ${
                          dayStaked === "1" ? "active" : ""
                        }`}
                        onClick={() => setDayStaked("1")}
                      >
                        1 DAY
                      </button>
                      <button
                        type="button"
                        className={`staked-day-btn ${
                          dayStaked === "7" ? "active" : ""
                        }`}
                        onClick={() => setDayStaked("7")}
                      >
                        7 DAYS
                      </button>
                      <button
                        type="button"
                        className={`staked-day-btn ${
                          dayStaked === "30" ? "active" : ""
                        }`}
                        onClick={() => setDayStaked("30")}
                      >
                        30 DAYS
                      </button>
                      <button
                        type="button"
                        className={`staked-day-btn ${
                          dayStaked === "180" ? "active" : ""
                        }`}
                        onClick={() => setDayStaked("180")}
                      >
                        180 DAYS
                      </button>
                      <button
                        type="button"
                        className={`staked-day-btn ${
                          dayStaked === "365" ? "active" : ""
                        }`}
                        onClick={() => setDayStaked("365")}
                      >
                        1 YEAR
                      </button>
                    </div>
                  </div>
                  <div className="d-center mt-[14px] mb-2">
                    <ExchangeBottomIcon />
                  </div>
                  <div className="text-center text-md mb-4">
                    {farm.lpSymbol} LP Staked
                  </div>
                  <div className="py-5 px-4 relative mb-5">
                    <img
                      src="/img/capital/roi-current-bg.png"
                      alt=""
                      className="absolute left-0 bottom-0 w-full h-full"
                    />
                    <div className="asset-card relative z-10">
                      <div className="rounded-[10px] bg-[#140236] text-center h-full">
                        <div className="flex justify-between items-center">
                          <div className="pt-4 pb-2 px-[14px] w-0 flex-grow text-left">
                            <div className="text-left text-md sm:text-lg font-semibold text-white text-opacity-30">
                              ${" "}
                              {toLocaleString(
                                calculateReturnPerDolar(
                                  dayStaked,
                                  apr,
                                  pcapPrice
                                ) *
                                  calculatorAmountInput *
                                  pcapPrice,
                                2,
                                2
                              )}
                            </div>
                            <div className="text-white text-opacity-40 text-sm font-bold">
                              {toLocaleString(
                                calculateReturnPerDolar(
                                  dayStaked,
                                  apr,
                                  pcapPrice
                                ) * calculatorAmountInput,
                                2,
                                2
                              )}{" "}
                              PCAP
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between text-md sm:text-lg font-semibold">
                    <span className="text-gradient-5">APY: 1,374.44%</span>
                    <span className="text-gradient-5">Daily APR: 3.66%</span>
                  </div>
                  <ul className="text-left font-medium text-white text-opacity-50 leading-[23px] mt-[17px] dots-list">
                    <li>
                      <div className="w-0 flex-grow">
                        Calculated based on current rates.
                      </div>
                    </li>
                    <li>
                      <div className="w-0 flex-grow">
                        All figures are estimates provided for your convenience
                        only, and by no means represent guaranteed returns.
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CustomModal>
      {/* Stake Modal */}
      <CustomModal
        open={stakeModalOpen}
        setOpen={setStakeModalOpen}
        onlyChildren={true}
      >
        <div className="relative z-10 m-auto max-w-[400px] bg-gradient9 rounded-[10px] p-[1px] overflow-hidden fadeInUp">
          <div className="bg-[#33026D] rounded-[10px]">
            <div className="bg-lpDetailsGradient absolute -bottom-full left-0 w-full h-full blur-[75px]" />
            <div className="relative z-10">
              <div className="flex justify-between items-start py-4 px-6 rounded-t-[10px] font-semibold">
                <div className="text-lg">Select Stake Type</div>
                <button type="button" onClick={() => setLpdetailsOpen(false)}>
                  <ClearIcon />
                </button>
              </div>
              <div className="bg-gradient8 h-[1px]"></div>
              <div className="px-4 py-8 text-center">
                <button
                  type="button"
                  className="btn-3 h-[45px] sm:font-bold px-4 w-full max-w-[120px] mb-[10px]"
                  onClick={() => {
                    setStakeModalOpen(false);
                    setZappedModalOpenFromHeader(true);
                  }}
                >
                  Zap
                </button>
                <div className="mb-9">
                  Automatically convert a token <br /> of your choice into
                  <span className="text-gradient-3 font-bold">
                    {farm.lpSymbol}
                  </span>{" "}
                  LP tokens
                </div>
                <button
                  type="button"
                  className="btn-3 h-[45px] sm:font-bold px-4 w-full max-w-[120px] bg-whiteGradient"
                  onClick={() => {
                    setStakeModalOpen(false);
                    setStakeNewModalOpen(true);
                  }}
                >
                  Stake LP
                </button>
                <div className="text-center mt-[10px]">
                  Stake your LP tokens
                </div>
              </div>
            </div>
          </div>
        </div>
      </CustomModal>

      {/* <CustomModal
        open={zappedModal || zappedModalOpenFromHeader}
        setOpen={() => {
          setZappedModal(false);
          setZappedModalOpenFromHeader(false);
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
                  <div className="text-lg mb-[9px]">Multi-Zapper</div>
                  <div className="font-normal text-sm">
                    Automatically <span className="text-blue">Zap</span> any
                    token into selected{" "}
                    <span className="text-blue">Tokens</span> or{" "}
                    <span className="text-blue">LP Tokens</span>
                  </div>
                </div>
                <button type="button" onClick={() => setZappedModal(false)}>
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
                          placeholder="2,370"
                        />
                        <div className="text-white text-opacity-50 text-sm font-medium text-left">
                          $123,839.51
                        </div>
                      </div>

                      <button
                        className="text-md sm:text-lg font-semibold pr-5 flex items-center gap-1"
                        type="button"
                        onClick={() => {
                          setOpen(!open);
                          setZappedModal(false);
                        }}
                      >
                        <img src={activeToken?.img} alt="" />{" "}
                        {activeToken?.title} <AngleDown />
                      </button>
                    </div>
                    <div className="text-sm text-white text-opacity-30 border-t border-white border-opacity-20 py-1 mx-[14px] flex justify-between font-medium">
                      <span>Balance:</span>
                      <span>9,364,332.77</span>
                    </div>
                  </div>
                </div>
                <div className="my-[15px] flex justify-between flex-wrap gap-4 items-center">
                  <div className="flex flex-wrap gap-1">
                    <button
                      className={`day-btn ${zapper === 25 ? "active" : ""}`}
                      onClick={() => setZapper(25)}
                      type="button"
                    >
                      25%
                    </button>
                    <button
                      className={`day-btn ${zapper === 50 ? "active" : ""}`}
                      onClick={() => setZapper(50)}
                      type="button"
                    >
                      50%
                    </button>
                    <button
                      className={`day-btn ${zapper === 75 ? "active" : ""}`}
                      onClick={() => setZapper(75)}
                      type="button"
                    >
                      75%
                    </button>
                    <button
                      className={`day-btn ${zapper === 100 ? "active" : ""}`}
                      onClick={() => setZapper(100)}
                      type="button"
                    >
                      MAX
                    </button>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="number"
                      placeholder="2"
                      className="h-[30px] w-[30px] bg-[#150238] text-center border border-[#2C086E] rounded-md mr-1 outline-none"
                      value={zapper}
                      onChange={(e) => {
                        if (e.target.value >= 100) {
                          setZapper(100);
                        } else {
                          setZapper(e.target.value);
                        }
                      }}
                    />
                    <span className="text-white text-opacity-50 font-600">
                      % Slippage
                    </span>
                  </div>
                </div>
                <div className="flex justify-center pt-3 pb-4">
                  <div
                    className="w-full max-w-[220px]"
                    style={{
                      background: `url('/img/capital/zap-select-bg.png') no-repeat center center / 100% 100%`,
                    }}
                  >
                    <div className="font-medium -translate-y-2 text-center leading-[1]">
                      Zap to
                    </div>
                    <div className="w-full max-w-[200px] select-option-2 mx-auto pb-[13px]">
                      <CustomSelectTwo
                        label="Select Token or LP"
                        value={selectedToken}
                        setValue={setSelectedToken}
                        options={[
                          {
                            value: "STOCK Token",
                            label: "STOCK Token",
                          },
                          {
                            value: "DAI-WPLS LP Token",
                            label: "DAI-WPLS LP Token",
                          },
                          {
                            value: "USDT-WPLS LP Token",
                            label: "USDT-WPLS LP Token",
                          },
                          {
                            value: "USDC-WPLS LP Token",
                            label: "USDC-WPLS LP Token",
                          },
                        ]}
                      />
                    </div>
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
                  <button
                    type="button"
                    className="btn-3 h-[45px] sm:font-bold mt-[15px] px-4 sm:w-full max-w-[142px]"
                    onClick={() => {
                      
                      setZappedModal(false);
                    }}
                  >
                    ZAP
                  </button>
                </div>
                <div className="text-center text-white mb-5">
                  Wallet Balance
                </div>
                <div className="flex flex-wrap px-4 xl:px-[39px] gap-5">
                  <div className="w-[calc(50%-10px)]">
                    <div className="text-center leading-[19px] mb-[6px] text-white text-opacity-50">
                      STOCK Token
                    </div>
                    <div className="asset-card bg-[#2C086E] bg-none">
                      <div className="rounded-[10px] bg-[#150238] text-center h-full">
                        <div className="pt-3 pb-2 text-md font-semibold px-3">
                          0.00
                        </div>
                        <div className="text-sm text-white text-opacity-50 border-t border-white border-opacity-20 py-1 px-3">
                          $0.00
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="w-[calc(50%-10px)]">
                    <div className="text-center leading-[19px] mb-[6px] text-white text-opacity-50">
                      DAI-WPLS LP
                    </div>
                    <div className="asset-card bg-[#2C086E] bg-none">
                      <div className="rounded-[10px] bg-[#150238] text-center h-full">
                        <div className="pt-3 pb-2 text-md font-semibold px-3">
                          0.00
                        </div>
                        <div className="text-sm text-white text-opacity-50 border-t border-white border-opacity-20 py-1 px-3">
                          $0.00
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="w-[calc(50%-10px)]">
                    <div className="text-center leading-[19px] mb-[6px] text-white text-opacity-50">
                      USDT-WPLS
                    </div>
                    <div className="asset-card bg-[#2C086E] bg-none">
                      <div className="rounded-[10px] bg-[#150238] text-center h-full">
                        <div className="pt-3 pb-2 text-md font-semibold px-3">
                          0.00
                        </div>
                        <div className="text-sm text-white text-opacity-50 border-t border-white border-opacity-20 py-1 px-3">
                          $0.00
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="w-[calc(50%-10px)]">
                    <div className="text-center leading-[19px] mb-[6px] text-white text-opacity-50">
                      USDC-WPLS
                    </div>
                    <div className="asset-card bg-[#2C086E] bg-none">
                      <div className="rounded-[10px] bg-[#150238] text-center h-full">
                        <div className="pt-3 pb-2 text-md font-semibold px-3">
                          0.00
                        </div>
                        <div className="text-sm text-white text-opacity-50 border-t border-white border-opacity-20 py-1 px-3">
                          $0.00
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CustomModal> */}
      <Zapper
        zappedModalOpenFromHeader={zappedModalOpenFromHeader}
        setZappedModalOpenFromHeader={setZappedModalOpenFromHeader}
      />
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
    </>
  );
};

const selectOptions = [
  {
    img: pcap,
    title: "PCAP",
    subtitle: "Pulse Capital",
    value: "1,283,299.88",
  },
  {
    img: pls,
    title: "PLS",
    subtitle: "Pulse",
    value: "1,283,299.88",
  },
  {
    img: dai,
    title: "DAI",
    subtitle: "DAI From Ethereum",
    value: "59,300.45",
  },
  {
    img: weth,
    title: "WETH",
    subtitle: "WETH From Ethereum",
    value: "1,283,299.88",
  },
  {
    img: plsx,
    title: "PLSX",
    subtitle: "PulseX",
    value: "1,283,299.88",
  },
  {
    img: inc,
    title: "INC",
    subtitle: "Incentive",
    value: "14,884.88",
  },
  {
    img: usdt,
    title: "USDT",
    subtitle: "USDT From Ethereum",
    value: "1,283,299.88",
  },
  {
    img: usdc,
    title: "USDC",
    subtitle: "USDC From Ethereum",
    value: "14,884.88",
  },
];

export default CapitalFarmsCard;
