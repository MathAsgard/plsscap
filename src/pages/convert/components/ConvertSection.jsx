import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import dai from "../../../assets/img/token/dai.svg";
import inc from "../../../assets/img/token/inc.svg";
import pcap from "../../../assets/img/token/pcap.svg";
import pls from "../../../assets/img/token/pls.svg";
import plsx from "../../../assets/img/token/plsx.svg";
import usdc from "../../../assets/img/token/usdc.svg";
import usdt from "../../../assets/img/token/usdt.svg";
import weth from "../../../assets/img/token/weth.svg";
import toast from "react-hot-toast";
import {
  AngleDown,
  Circle,
  ExchangeIcon,
  InfoIcon,
} from "../../../components/Icon";
import SelectModal from "../../../components/SelectModal";
import BigNumber from "bignumber.js/bignumber";
import useInterval from "../../../hooks/useInterval";
import contracts from "../../../config/constants/contracts.js";
import {
  multicall,
  writeContract,
  fetchBalance,
  waitForTransaction,
} from "@wagmi/core";
import { useAccount } from "wagmi";
import CountdownCard from "../../../components/CountdownCard";
import lpABI from "../../../config/abi/lpToken.json";
import Zapper from "../../../components/Zapper";
import CustomToast from "../../../components/CustomToast.jsx";

BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 18,
});

function toLocaleString(num, min, max) {
  const _number = isNaN(Number(num)) ? 0 : Number(num);
  return _number.toLocaleString(undefined, {
    minimumFractionDigits: min,
    maximumFractionDigits: max,
  });
}

let userLocks = [];
const ConvertSection = ({ ...props }) => {
  const [open, setOpen] = React.useState(false);
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [amountInput, setAmountInput] = React.useState(0);
  const [stockInput, setStockInput] = React.useState(0);
  const [lpBalance, setLpBalance] = React.useState(new BigNumber(0));
  const [stockBalance, setStockBalance] = React.useState(new BigNumber(0));
  const [stockPrice, setStockPrice] = React.useState(0);
  const [approved, setApproved] = React.useState(false);
  const [lockInput, setLockInput] = React.useState(0);
  const [activeToken, setActiveToken] = React.useState(
    selectOptions[activeIndex]
  );
  const [view, setView] = React.useState("list");
  const [exchangeDirection, setExchangeDirection] = React.useState("to");
  const [zappedModalOpenFromHeader, setZappedModalOpenFromHeader] =
    React.useState(false);

  const handleSelect = (index) => {
    setOpen(!open);
    if (!index && index !== 0) {
      return;
    }
    setActiveIndex(index);
    setActiveToken(selectOptions[index]);
  };

  const userAccount = useAccount({
    onConnect() {
      //setConnected(true)
    },
    onDisconnect() {
      //setConnected(false)
    },
  });

  async function getStats() {
    const activeTokenAddress =
      selectOptions[activeIndex].address !==
      "0xA1077a294dDE1B09bB078844df40758a5D0f9a27"
        ? selectOptions[activeIndex].address
        : "0x0000000000000000000000000000000000000000";
    const [
      _userLpBalance,
      _allowance,
      _userStockBalance,
      _allowanceStock,
      _daiPlsReserves,
      _daiPlsSupply,
      _userLocks,
    ] = await multicall({
      contracts: [
        {
          address: activeTokenAddress,
          abi: lpABI,
          functionName: "balanceOf",
          args: [userAccount.address],
        },
        {
          address: activeTokenAddress,
          abi: lpABI,
          functionName: "allowance",
          args: [userAccount.address, contracts.zapper.address],
        },
        {
          ...contracts.stockToken,
          functionName: "balanceOf",
          args: [userAccount.address],
        },
        {
          ...contracts.stockToken,
          functionName: "allowance",
          args: [userAccount.address, contracts.zapper.address],
        },
        {
          address: "0xe56043671df55de5cdf8459710433c10324de0ae",
          abi: lpABI,
          functionName: "getReserves",
          args: [],
        },
        {
          address: "0xe56043671df55de5cdf8459710433c10324de0ae",
          abi: lpABI,
          functionName: "totalSupply",
          args: [],
        },
        // {
        // 	...contracts.stockToken,
        // 	functionName: 'userLocksLength',
        // 	args: [userAccount.address]
        // },
        {
          ...contracts.stockToken,
          functionName: "userLocksArray",
          args: [userAccount.address],
        },
      ],
    });
    const _stockBalance = new BigNumber(
      _userStockBalance.result ? _userStockBalance.result : 0
    ).div(1e18);
    setStockBalance(_stockBalance);
    if (activeIndex !== 0 && exchangeDirection == "to") {
      const _lpBalance = new BigNumber(
        _userLpBalance.result ? _userLpBalance.result : 0
      ).div(1e18);
      setLpBalance(_lpBalance);
      const _approved = new BigNumber(_allowance.result).greaterThan(
        _lpBalance.mul(1e18)
      );
      setApproved(_approved);
    } else if (exchangeDirection == "to") {
      const _lpBalance = new BigNumber(
        _userLpBalance.result ? _userLpBalance.result : 0
      ).div(1e18);
      setLpBalance(_lpBalance);
      setApproved(true);
    } else {
      const _approved = new BigNumber(_allowanceStock.result).greaterThan(
        _stockBalance.mul(1e18)
      );
      setApproved(_approved);
    }
    const _stockPrice =
      (Number(_daiPlsReserves.result[0]) * Number(selectOptions[0].price) +
        Number(_daiPlsReserves.result[1])) /
      Number(_daiPlsSupply.result);
    setStockPrice(_stockPrice);
    userLocks = _userLocks.result
      .map((el, i) => {
        return { stakeId: i, ...el };
      })
      .reverse();
    userLocks = userLocks.filter((lock) => {
      return lock.claimed == false;
    });
    console.log(userLocks);
  }
  async function getTokenBalances() {
    const plsBalance = await fetchBalance({
      address: userAccount.address,
    });
    const tokens = [
      "0xefD766cCb38EaF1dfd701853BFCe31359239F305", //dai
      "0x2fa878Ab3F87CC1C9737Fc071108F904c0B0C95d", //inc
      //'0x2b591e99afE9f32eAA6214f7B7629768c40Eeb39', //hex
      "0x95B303987A60C71504D99Aa1b13B4DA07b0790ab", //plsx
      //'0xb17D901469B9208B17d916112988A3FeD19b5cA1', //wbtc
      "0x02DcdD04e3F455D838cd1249292C58f3B79e3C3C", //eth
      "0x15D38573d2feeb82e7ad5187aB8c1D52810B1f07", //usdc
      "0x0Cb6F5a34ad42ec934882A05265A7d5F59b51A2f", //usdt
    ];
    const pairs = [
      "0xe56043671df55de5cdf8459710433c10324de0ae", //wpls
      "0xf808bb6265e9ca27002c0a04562bf50d4fe37eaa", //inc
      "0xf1f4ee610b2babb05c635f726ef8b0c568c8dc65", //hex
      "0x1b45b9148791d3a104184cd5dfe5ce57193a3ee9", //plsx
      "0xdb82b0919584124a0eb176ab136a0cc9f148b2d1", //wbtc
      "0x42abdfdb63f3282033c766e72cc4810738571609", //eth
    ];
    const response = await fetch(
      `https://api.dexscreener.com/latest/dex/pairs/pulsechain/${pairs.join(
        ","
      )}`
    );
    const rsps = await response.json();
    const _prices = tokens.map((token) => {
      if (
        token === "0xefD766cCb38EaF1dfd701853BFCe31359239F305" ||
        token === "0x15D38573d2feeb82e7ad5187aB8c1D52810B1f07" ||
        token === "0x0Cb6F5a34ad42ec934882A05265A7d5F59b51A2f"
      )
        return "1";
      return rsps.pairs.filter((e) => e.baseToken.address == token)[0].priceUsd;
    });
    const prices = [
      rsps.pairs.filter(
        (e) =>
          e.baseToken.address == "0xA1077a294dDE1B09bB078844df40758a5D0f9a27"
      )[0].priceUsd,
    ].concat(_prices);

    const _defaultTokenReserves = rsps.pairs[0].liquidity.usd;
    const _tokens = await multicall({
      contracts: tokens.map((token) => {
        return {
          address: token,
          abi: lpABI,
          functionName: "balanceOf",
          args: [userAccount.address],
        };
      }),
    });
    const balances = [new BigNumber(plsBalance?.value)].concat(
      _tokens.map((token) => new BigNumber(token.result))
    );
    tokens.forEach((token, index) => {
      const filtered = selectOptions.filter((i) => i.address === token)[0];
      filtered.value = balances[index + 1].div(1e18);
      filtered.price = prices[index + 1];
    });

    selectOptions[0].value = new BigNumber(plsBalance.value).div(1e18);
    selectOptions[0].price = prices[0];
  }

  async function approve() {
    toast.custom((t) => (
      <CustomToast
        toast={toast}
        t={t}
        type={"pending"}
        description={"Awaiting for approval..."}
      />
    ));
    const tx = writeContract({
      address:
        exchangeDirection === "to"
          ? selectOptions[activeIndex].address
          : contracts.stockToken.address,
      abi: lpABI,
      functionName: "approve",
      account: userAccount.address,
      args:
        exchangeDirection === "to"
          ? [contracts.zapper.address, lpBalance.mul(1e18).add(1)]
          : [contracts.zapper.address, stockBalance.mul(1e18).add(1)],
    });
    const { hash } = await tx;
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
        title={`${selectOptions[activeIndex].title} Contract Approved`}
        description={<></>}
        hash={hash}
      />
    ));
    getStats();
    localStorage["warren-" + userAccount.address] +=
      "...Approved " +
      (exchangeDirection === "to"
        ? toLocaleString(lpBalance) + "LP Tokens "
        : toLocaleString(stockBalance) + "STOCK ") +
      "to the zapper contract";
  }
  async function convert() {
    const amountToZap = new BigNumber(amountInput.toString()).times(1e18);
    const amountToBurn = new BigNumber(stockInput.toString()).times(1e18);
    if (exchangeDirection === "to") {
      if (activeIndex == 0) {
        const tx = writeContract({
          ...contracts.zapper,
          functionName: "swapAndLiquifyETH",
          account: userAccount.address,
          args: [10],
          value: amountToZap,
        });
        toast.custom((t) => (
          <CustomToast
            toast={toast}
            t={t}
            type={"pending"}
            description={"Awaiting for approval..."}
          />
        ));
        const { hash } = await tx;
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
            title={"CONVERTED!"}
            description={
              <div className="font-[500] leading-[17px] text-[16px] mt-2">
                You Converted{" "}
                <span className="text-[#01BCFF]">
                  {amountInput.toString()} {selectOptions[activeIndex].title}
                </span>{" "}
                to <span className="text-[#01BCFF]">{stockInput} STOCK</span>
              </div>
            }
            hash={hash}
          />
        ));
      } else {
        const tx = writeContract({
          ...contracts.zapper,
          functionName: "swapAndLiquifyToken",
          account: userAccount.address,
          args: [selectOptions[activeIndex].address, amountToZap, 10],
        });
        toast.custom((t) => (
          <CustomToast
            toast={toast}
            t={t}
            type={"pending"}
            description={"Awaiting for approval..."}
          />
        ));
        const { hash } = await tx;
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
            title={"CONVERTED!"}
            description={
              <div className="font-[500] leading-[17px] text-[16px] mt-2">
                You Converted{" "}
                <span className="text-[#01BCFF]">
                  {amountInput.toString()} {selectOptions[activeIndex].title}
                </span>{" "}
                to <span className="text-[#01BCFF]">{stockInput} STOCK</span>
              </div>
            }
            hash={hash}
          />
        ));
      }
    } else {
      if (activeIndex == 0) {
        const tx = writeContract({
          ...contracts.zapper,
          functionName: "swapStockToETH",
          account: userAccount.address,
          args: [amountToBurn, 10],
        });
        toast.custom((t) => (
          <CustomToast
            toast={toast}
            t={t}
            type={"pending"}
            description={"Awaiting for approval..."}
          />
        ));
        const { hash } = await tx;
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
            title={"CONVERTED!"}
            description={
              <div className="font-[500] leading-[17px] text-[16px] mt-2">
                You Converted{" "}
                <span className="text-[#01BCFF]">
                  {amountInput.toString()} STOCK
                </span>{" "}
                to{" "}
                <span className="text-[#01BCFF]">
                  {stockInput} {selectOptions[activeIndex].title}
                </span>
              </div>
            }
            hash={hash}
          />
        ));
      } else {
        const tx = writeContract({
          ...contracts.zapper,
          functionName: "swapStockToTokens",
          account: userAccount.address,
          args: [amountToBurn, selectOptions[activeIndex].address, 10],
        });
        toast.custom((t) => (
          <CustomToast
            toast={toast}
            t={t}
            type={"pending"}
            description={"Awaiting for approval..."}
          />
        ));
        const { hash } = await tx;
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
            title={"CONVERTED!"}
            description={
              <div className="font-[500] leading-[17px] text-[16px] mt-2">
                You Converted{" "}
                <span className="text-[#01BCFF]">
                  {amountInput.toString()} STOCK
                </span>{" "}
                to{" "}
                <span className="text-[#01BCFF]">
                  {stockInput} {selectOptions[activeIndex].title}
                </span>
              </div>
            }
            hash={hash}
          />
        ));
      }
    }
    getStats();
    localStorage["warren-" + userAccount.address] +=
      "...Converted " +
      (exchangeDirection === "to"
        ? toLocaleString(amountToZap.div(1e18), 2, 2) +
          " " +
          selectOptions[activeIndex].title +
          " to STOCK"
        : toLocaleString(amountToBurn.div(1e18), 2, 2) +
          " STOCK to " +
          selectOptions[activeIndex].title);
  }

  async function lock() {
    const _amount = new BigNumber(lockInput.toString()).times(1e18);
    const tx = writeContract({
      ...contracts.stockToken,
      functionName: "lock",
      account: userAccount.address,
      args: [_amount],
    });
    toast.custom((t) => (
      <CustomToast
        toast={toast}
        t={t}
        type={"pending"}
        description={"Awaiting for approval..."}
      />
    ));
    const { hash } = await tx;
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
        title={`LOCKED!`}
        description={
          <div className="font-[500] leading-[17px] text-[16px] mt-2">
            You have locked{" "}
            <span className="text-[#01BCFF]">{lockInput.toString()} STOCK</span>{" "}
            tokens for 14 days!
          </div>
        }
        hash={hash}
      />
    ));
    localStorage["warren-" + userAccount.address] +=
      "...Locked" + toLocaleString(_amount.div(1e18), 2, 2) + " STOCK";
    getStats();
  }
  async function burnLocked(_stakeId) {
    const tx = writeContract({
      ...contracts.stockToken,
      functionName: "burnLocked",
      account: userAccount.address,
      args: [_stakeId],
    });
    toast.custom((t) => (
      <CustomToast
        toast={toast}
        t={t}
        type={"pending"}
        description={"Awaiting for approval..."}
      />
    ));
    const { hash } = await tx;
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
            Your tokens have been unlocked and sent to your wallet!
          </div>
        }
        hash={hash}
      />
    ));
    localStorage["warren-" + userAccount.address] +=
      "...Claimed " +
      toLocaleString(
        Number(userLocks.filter((e) => e.stakeId == _stakeId)[0].amount) / 1e18,
        2,
        2
      ) +
      " STOCK from a lock";
    getStats();
  }
  useEffect(() => {
    getTokenBalances();
    getStats();
  }, []);

  useInterval(() => {
    getTokenBalances();
    getStats();
  }, 5000);
  return (
    <>
      <section className="pt-[74px] relative">
        <div className="noisy-bg top-[-100px]" />
        <div className="container xl:max-w-[1070px] mx-auto relative z-[10]">
          <div className="flex flex-wrap gap-y-5 items-end gap-x-5 mb-8">
            <h5 className="text-2xl sm:text-[40px] font-medium flex items-center gap-5 flex-grow mb-1">
              <div>Convert Tokens</div>
              <span className="w-0 flex-grow bg-gradient8 h-[2px]"></span>
            </h5>
            <div className="w-full md:w-auto text-right md:min-w-[235px] flex flex-wrap items-center gap-2 md:flex-col md:items-end justify-end">
              <div className="md:w-full">
                <div className="text-center">
                  Need <span className="text-gradient-3">PCAP</span> or{" "}
                  <span className="text-gradient-3">STOCK</span> Tokens?
                </div>
              </div>
              <button
                className="btn-2 md:w-full md:max-w-[235px]"
                onClick={() => setZappedModalOpenFromHeader(true)}
              >
                Buy Tokens
              </button>
            </div>
          </div>
          <div className="grid lg:grid-cols-2 gap-5 xl:gap-10">
            <div className="asset-card h-full">
              <div className="inner">
                <img
                  src="/img/asset-card-shape.png"
                  className="absolute top-0 right-0 w-full rounded-[10px] blur-[75px]"
                  alt=""
                />
                <div className="py-6 md:py-7 h-full relative z-[11]">
                  <h5 className="text-md sm:text-lg font-semibold flex items-center gap-5 flex-grow mb-6 px-4 xl:pl-[39px] pr-0 xl:text-xl">
                    <div>Convert</div>
                    <span className="w-0 flex-grow bg-gradient8 h-[1px]"></span>
                  </h5>
                  <div className="px-4 xl:px-[39px] gap-5 md:gap-[27px] md:gap-y-[17px]">
                    <div
                      className={`flex ${
                        exchangeDirection === "from"
                          ? "flex-col"
                          : "flex-col-reverse"
                      }`}
                    >
                      <div>
                        <div className="font-medium mb-[9px] text-white text-opacity-50 mt-1">
                          {exchangeDirection !== "from" ? "To" : "From"}
                        </div>
                        <div className="asset-card shadow-none">
                          <div className="rounded-[10px] bg-[#140236] text-center h-full">
                            <div className="flex justify-between items-center">
                              <div className="pt-4 pb-2 px-[14px] w-0 flex-grow">
                                <input
                                  type="number"
                                  className="w-full text-md sm:text-lg xl:text-xl font-semibold bg-transparent border-0 outline-none text-left text-white placeholder:text-white"
                                  placeholder="0.00"
                                  value={stockInput}
                                  onChange={(e) => {
                                    var val = e.target.value.replace(/\,/g, "");
                                    setStockInput(val);
                                    setAmountInput(
                                      (val * stockPrice) /
                                        selectOptions[activeIndex].price
                                    );
                                  }}
                                />
                                <div className="text-white text-opacity-50 text-sm font-bold text-left">
                                  ≈ $
                                  {toLocaleString(
                                    Number(amountInput) *
                                      selectOptions[activeIndex]?.price,
                                    2,
                                    2
                                  )}
                                </div>
                              </div>
                              <div className="text-md sm:text-lg font-semibold pr-5 flex items-center gap-1">
                                <Circle /> STOCK
                              </div>
                            </div>
                            <div className="text-sm text-white text-opacity-50 border-t border-white border-opacity-20 py-1 mx-[14px] flex justify-between font-medium">
                              <span>Wallet Balance</span>
                              <span
                                onClick={() => {
                                  setStockInput(stockBalance);
                                  setAmountInput(
                                    (stockBalance * stockPrice) /
                                      selectOptions[activeIndex].price
                                  );
                                }}
                              >
                                {toLocaleString(stockBalance, 9, 9)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="mt-[25px] flex justify-center">
                        <button
                          type="button"
                          onClick={() => {
                            setExchangeDirection(
                              exchangeDirection === "from" ? "to" : "from"
                            );
                            setAmountInput(0);
                            setStockInput(0);
                          }}
                        >
                          <ExchangeIcon />
                        </button>
                      </div>
                      <div>
                        <div className="font-medium mb-[9px] text-white text-opacity-50 mt-1">
                          {exchangeDirection === "from" ? "To" : "From"}
                        </div>
                        <div className="asset-card shadow-none">
                          <div className="rounded-[10px] bg-[#140236] text-center h-full">
                            <div className="flex justify-between items-center">
                              <div className="pt-4 pb-2 px-[14px] w-0 flex-grow">
                                <input
                                  type="string"
                                  className="w-full text-md sm:text-lg xl:text-xl font-semibold bg-transparent border-0 outline-none text-left text-white placeholder:text-white"
                                  placeholder="0.00"
                                  value={amountInput}
                                  onChange={(e) => {
                                    var val = e.target.value.replace(/\,/g, "");
                                    setAmountInput(val);
                                    setStockInput(
                                      (val * selectOptions[activeIndex].price) /
                                        stockPrice
                                    );
                                  }}
                                />
                                <div className="text-white text-opacity-50 text-sm font-bold text-left">
                                  $
                                  {toLocaleString(
                                    Number(amountInput) *
                                      selectOptions[activeIndex]?.price,
                                    2,
                                    2
                                  )}
                                </div>
                              </div>
                              <button
                                className="text-md sm:text-lg font-semibold pr-5 flex items-center gap-1"
                                type="button"
                                onClick={() => setOpen(true)}
                              >
                                <img src={activeToken?.img} alt="" />{" "}
                                {activeToken?.title} <AngleDown />
                              </button>
                            </div>
                            <div className="text-sm text-white text-opacity-50 border-t border-white border-opacity-20 py-1 mx-[14px] flex justify-between font-medium">
                              <span>Wallet Balance</span>
                              <span
                                onClick={() => {
                                  setAmountInput(
                                    selectOptions[activeIndex].value
                                  );
                                  setStockInput(
                                    (selectOptions[activeIndex].value *
                                      selectOptions[activeIndex].price) /
                                      stockPrice
                                  );
                                }}
                              >
                                {toLocaleString(
                                  selectOptions[activeIndex].value
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="pt-[11px] pb-[13px] flex items-center gap-[11px] text-white text-opacity-50">
                      <span className="w-0 flex-grow h-[1px] bg-white bg-opacity-50" />
                      <InfoIcon />
                      <span>8% Sell Tax</span>
                      <InfoIcon />
                      <span className="w-0 flex-grow h-[1px] bg-white bg-opacity-50" />
                    </div>
                    {approved && (
                      <button
                        type="button"
                        className="btn-3 w-full h-[45px] sm:text-lg sm:font-semibold"
                        onClick={() => convert()}
                      >
                        Convert
                      </button>
                    )}
                    {!approved && (
                      <button
                        type="button"
                        className="btn-3 w-full h-[45px] sm:text-lg sm:font-semibold"
                        onClick={() => approve()}
                      >
                        Approve
                      </button>
                    )}
                    <div className="mt-6 text-white text-center text-opacity-50 text-sm font-normal">
                      To avoid the 8% STOCK Sell Tax, lock your STOCK tokens for
                      14 days.
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-5 xl:gap-[60px]">
              <div className="asset-card h-full">
                <div className="inner">
                  <img
                    src="/img/exchange-img.png"
                    className="absolute top-4 right-4 z-[11] max-w-[30%]"
                    alt=""
                  />
                  <img
                    src="/img/asset-card-shape.png"
                    className="absolute top-0 right-0 w-full rounded-[10px] blur-[75px]"
                    alt=""
                  />
                  <div className="py-12 md:py-[75px] h-full relative z-[11] px-6 md:px-[50px]">
                    <div className="text-lg font-semibold mb-[7px]">
                      Convert between
                    </div>
                    <div className="text-4xl font-bold">
                      <span className="text-gradient-3">Assets</span>{" "}
                      <span className="text-lg font-medium">and</span> <br />
                      <span className="text-gradient-3">STOCK Tokens</span>{" "}
                    </div>
                  </div>
                </div>
              </div>
              <div className="asset-card h-full">
                <div className="inner">
                  <img
                    src="/img/asset-card-shape.png"
                    className="absolute top-0 right-0 w-full rounded-[10px] blur-[75px]"
                    alt=""
                  />
                  <img
                    src="/img/lock-icon.png"
                    className="absolute bottom-0 right-0 z-[11] max-w-[30%]"
                    alt=""
                  />
                  <div className="py-6 md:py-[26px] h-full relative z-[11] px-6 md:px-[50px]">
                    <div className="text-lg font-medium mb-[7px]">
                      Avoid a 8% Sell Tax
                    </div>
                    <div className="text-4xl font-bold mb-5">
                      <span className="text-gradient-3 xl:text-[44px]">
                        LOCK UP
                      </span>{" "}
                      <div className="text-lg font-medium mb-[7px]">
                        STOCK Tokens for
                      </div>
                      <span className="text-gradient-3 text-4xl">14 Days</span>{" "}
                    </div>
                    <button
                      type="button"
                      className="btn-3 text-lg font-semibold h-10 min-w-[100px] px-4"
                    >
                      Lock{" "}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="pt-20 md:pt-[95px] relative">
        <div className="noisy-bg top-[-50px]" />
        <div className="container xl:max-w-[1057px] relative z-[10]">
          <div className="mb-4 sm:mb-[38px]">
            <div className="flex flex-wrap gap-5">
              <h5 className="text-2xl sm:text-4xl xl:text-[40px] font-medium flex items-center gap-5 flex-grow">
                <div>STOCK Lock</div>
                <span className="w-0 flex-grow bg-gradient8 h-[2px]"></span>
              </h5>
              <div className="rounded-full bg-tableRowBorder relative p-[1px] pb-0">
                <div className="flex flex-wrap gap-x-2 sm:gap-x-0 gap-y-2 items-center bg-[#1C0050] rounded-full relative z-10">
                  <button
                    type="button"
                    className={`view-btn ${view === "list" ? "active" : ""}`}
                    onClick={() => setView("list")}
                  >
                    <span>List View</span>
                  </button>
                  <button
                    type="button"
                    className={`view-btn ${view === "grid" ? "active" : ""}`}
                    onClick={() => setView("grid")}
                  >
                    <span>Grid View</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap justify-between gap-5">
            <div
              className={`w-full ${
                view === "grid"
                  ? ""
                  : "lg:w-[calc(50%-10px)] xl:w-[calc(50%-20px)]"
              }`}
            >
              <div className="flex flex-wrap gap-5 xl:gap-10">
                <div
                  className={`asset-card w-full ${
                    view === "grid"
                      ? "lg:w-[calc(50%-10px)] xl:w-[calc(50%-20px)]"
                      : ""
                  }`}
                >
                  <div className="inner">
                    <img
                      src="/img/asset-card-shape.png"
                      className="absolute top-0 right-0 w-full rounded-[10px] blur-[75px]"
                      alt=""
                    />
                    <img
                      src="/img/lock-icon.png"
                      className="absolute bottom-0 right-0 z-[11] max-w-[30%]"
                      alt=""
                    />
                    <div className="py-6 md:py-[26px] h-full relative z-[11] px-6 md:px-[50px]">
                      <div className="text-lg font-medium mb-[7px]">
                        Avoid a 8% Sell Tax
                      </div>
                      <div className="text-4xl font-bold mb-5">
                        <span className="text-gradient-3 xl:text-[44px]">
                          LOCK UP
                        </span>{" "}
                        <div className="text-lg font-medium mb-[7px]">
                          STOCK Tokens for
                        </div>
                        <span className="text-gradient-3 text-4xl">
                          14 Days
                        </span>{" "}
                      </div>
                      <button
                        type="button"
                        className="btn-3 text-lg font-semibold h-10 min-w-[100px] px-4"
                      >
                        Lock{" "}
                      </button>
                    </div>
                  </div>
                </div>
                <div
                  className={`asset-card w-full ${
                    view === "grid"
                      ? "lg:w-[calc(50%-10px)] xl:w-[calc(50%-20px)]"
                      : ""
                  }`}
                >
                  <div className="inner">
                    <img
                      src="/img/asset-card-shape.png"
                      className="absolute top-0 right-0 w-full rounded-[10px] blur-[75px]"
                      alt=""
                    />
                    <div className="py-6 md:py-7 h-full relative z-[11]">
                      <h5 className="text-md sm:text-lg font-semibold flex items-center gap-5 flex-grow mb-6 px-4 xl:pl-[39px] pr-0">
                        <div>Lock</div>
                        <span className="w-0 flex-grow bg-gradient8 h-[1px]"></span>
                      </h5>
                      <div className="px-4 xl:px-[39px] gap-5 md:gap-[27px] md:gap-y-[17px]">
                        <div className="text-sm tracking-[-0.01em] text-white mt-1 mb-3">
                          To avoid the{" "}
                          <span className="text-gradient-3">
                            8% STOCK Sell Tax
                          </span>
                          , lock your STOCK tokens for 14 days.
                        </div>
                        <div className="asset-card">
                          <div className="rounded-[10px] bg-[#140236] text-center h-full">
                            <div className="flex justify-between items-center">
                              <div className="pt-4 pb-2 px-[14px] w-0 flex-grow">
                                <input
                                  type="number"
                                  className="w-full text-md sm:text-lg xl:text-xl font-semibold bg-transparent border-0 outline-none text-left text-white placeholder:text-white"
                                  placeholder="0.00"
                                  value={lockInput}
                                  onChange={(e) => {
                                    setLockInput(e.target.value);
                                  }}
                                />
                                <div className="text-white text-opacity-50 text-sm font-bold text-left">
                                  ${toLocaleString(lockInput * stockPrice)}
                                </div>
                              </div>
                              <div className="text-md sm:text-lg font-semibold pr-5 flex items-center gap-1 text-gradient-5">
                                <Circle /> STOCK
                              </div>
                            </div>
                            <div
                              className="text-sm text-white text-opacity-50 border-t border-white border-opacity-20 py-1 mx-[14px] flex justify-between font-medium"
                              onClick={() => {
                                setLockInput(stockBalance);
                              }}
                            >
                              <span>Wallet Balance</span>
                              <span>{toLocaleString(stockBalance)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="mb-[19px]" />
                        <button
                          type="button"
                          className="btn-3 w-full h-[45px] font-semibold sm:font-semibold"
                          onClick={() => {
                            lock();
                          }}
                        >
                          Lock Tokens
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {view === "list" ? (
              <div className="w-full lg:w-[calc(50%-10px)] xl:w-[calc(50%-20px)]">
                <div className="asset-card h-full">
                  <div className="inner">
                    <img
                      src="/img/asset-card-shape.png"
                      className="absolute top-0 right-0 w-full rounded-[10px] blur-[75px]"
                      alt=""
                    />
                    <div className="pt-6 md:pt-10 pb-2 h-full relative z-[11]">
                      <h5 className="text-md sm:text-xl font-semibold flex items-center gap-5 flex-grow mb-[18px] px-4 xl:pl-[39px] pr-0">
                        <div>The LOCK</div>
                        <span className="w-0 flex-grow bg-gradient8 h-[1px]"></span>
                      </h5>
                      <div className="px-4 xl:px-[39px]">
                        <div className="text-sm xl:pl-6">
                          When the Lock duration ends claim your{" "}
                          <span className="text-medium">STOCK</span> as LP
                        </div>
                        <div className="overflow-x-auto">
                          <div className="w-full">
                            <table className="custom-table border-spacing-y-5">
                              <thead>
                                <tr className="font-semibold md:text-lg">
                                  <th className="text-nowrap bg-[#150238] py-2 px-4 font-semibold sm:text-lg first:rounded-l-[5px] last:rounded-r-[5px]">
                                    Token
                                  </th>
                                  <th className="text-nowrap bg-[#150238] py-2 px-4 font-semibold sm:text-lg first:rounded-l-[5px] last:rounded-r-[5px]">
                                    Duration
                                  </th>
                                  <th className="text-nowrap bg-[#150238] py-2 px-4 font-semibold sm:text-lg first:rounded-l-[5px] last:rounded-r-[5px]">
                                    Action
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {userLocks
                                  .map((lockInfo, index) => (
                                    <tr
                                      className="text-center"
                                      key={lockInfo.amount}
                                    >
                                      <td className="custom-table-td px-4 py-[15px] bg-[#150238]">
                                        <div className="md:font-semibold text-nowrap">
                                          <span className="text-gradient-4">
                                            {toLocaleString(
                                              Number(lockInfo.amount) / 1e18
                                            )}
                                          </span>
                                        </div>
                                      </td>
                                      <td className="custom-table-td px-2 py-[15px] bg-[#150238]">
                                        <div className="md:font-medium text-normal text-opacity-50 text-nowrap">
                                          <CountdownCard
                                            targetDate={new Date(
                                              Number(lockInfo.timestamp) * 1000
                                            ).toString()}
                                            showDays={true}
                                            shortend={true}
                                          />
                                        </div>
                                      </td>
                                      <td className="custom-table-td px-2 pr-4 py-[15px] bg-[#150238]">
                                        <button
                                          type="button"
                                          className="stake-btn text-sm font-semibold h-8 w-[90px] bg-[#0D0320]"
                                          onClick={() => {
                                            burnLocked(index);
                                          }}
                                        >
                                          Claim
                                        </button>
                                      </td>
                                    </tr>
                                  ))
                                  .slice(0, 5)}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
        <div className="container relative z-10">
          {view === "grid" && (
            <div className="w-full flex flex-wrap gap-5 pt-20 md:pt-[95px] ">
              {userLocks.map((lockInfo, index) => (
                <div
                  className="w-full lg:w-[calc(50%-10px)] xl:w-[calc(33%-20px)]"
                  key={index}
                >
                  <LockCard
                    lockInfo={lockInfo}
                    burnLocked={burnLocked}
                    stockPrice={stockPrice}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

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
      <Zapper
        zappedModalOpenFromHeader={zappedModalOpenFromHeader}
        setZappedModalOpenFromHeader={setZappedModalOpenFromHeader}
      />
    </>
  );
};

const LockCard = ({ lockInfo, burnLocked, stockPrice }) => {
  return (
    <>
      <div className="asset-card h-full">
        <div className="inner">
          <div
            className="pb-4 pt-5 sm:pt-7 px-3 sm:px-5 h-full"
            style={{
              background: `url('/img/asset-card-shape.png') no-repeat top right / cover`,
            }}
          >
            <div className="flex flex-wrap justify-between gap-y-4">
              <div className="w-[calc(50%-5px)]">
                <div className="dashboard-card w-full max-w-full">
                  <img
                    src="/img/stake-card-bg.png"
                    className="absolute left-0 w-full h-[calc(100%-5px)]"
                    alt=""
                  />
                  <div className="relative z-10">
                    <h6 className="text-xs sm:text-normal font-medium -translate-y-1/2 mx-4 m-0 -mb-2 text-white">
                      <span className="text-gradient-4">Locked</span> Tokens
                    </h6>
                    <div className="bg-tableBg shadow-innerShadow rounded-[5px]">
                      <h2 className="text-sm sm:text-lg font-semibold pt-3 pb-2">
                        {toLocaleString(Number(lockInfo.amount) / 1e18)}
                      </h2>
                      <p className="text-sm pb-[2px] border-t border-white border-opacity-20">
                        <span className="text-sm text-gradient-3 min:w-[155px]">
                          $
                          {toLocaleString(
                            (Number(lockInfo.amount) / 1e18) * stockPrice
                          )}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-[calc(50%-5px)]">
                <div className="dashboard-card w-full max-w-full">
                  <img
                    src="/img/stake-card-bg.png"
                    className="absolute left-0 w-full h-[calc(100%-5px)]"
                    alt=""
                  />
                  <div className="relative z-10">
                    <h6 className="text-xs sm:text-normal font-medium -translate-y-1/2 mx-4 m-0 -mb-2 text-white">
                      <span className="text-gradient-4">Lock</span> Duration
                    </h6>
                    <div className="bg-tableBg shadow-innerShadow rounded-[5px]">
                      <h2 className="text-sm sm:text-md font-medium pt-3 pb-2">
                        <CountdownCard
                          targetDate={new Date(
                            Number(lockInfo.timestamp) * 1000
                          ).toString()}
                          showDays={true}
                          shortend={true}
                        />
                      </h2>
                      <p className="text-sm text-white text-opacity-50 pb-[2px] border-t border-white border-opacity-20">
                        Utill Tokens Unlock
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full">
                <button
                  type="button"
                  className="stake-btn w-full h-[40px] text-[#808898]"
                  onClick={() => {
                    burnLocked(lockInfo.stakeId);
                  }}
                >
                  Claim Stake
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export const selectOptions = [
  // {
  // 	img: pcap,
  // 	title: "PCAP",
  // 	subtitle: "Pulse Capital",
  // 	value: "1,283,299.88",
  // },
  {
    address: "0xA1077a294dDE1B09bB078844df40758a5D0f9a27",
    img: pls,
    title: "PLS",
    subtitle: "Pulse",
    value: "0.00",
    price: "0.00",
  },
  {
    address: "0xefD766cCb38EaF1dfd701853BFCe31359239F305",
    img: dai,
    title: "DAI",
    subtitle: "DAI From Ethereum",
    value: "0.00",
    price: "0.00",
  },
  {
    address: "0x02DcdD04e3F455D838cd1249292C58f3B79e3C3C",
    img: weth,
    title: "WETH",
    subtitle: "WETH From Ethereum",
    value: "0.00",
    price: "0.00",
  },
  {
    address: "0x95B303987A60C71504D99Aa1b13B4DA07b0790ab",
    img: plsx,
    title: "PLSX",
    subtitle: "PulseX",
    value: "0.00",
    price: "0.00",
  },
  {
    address: "0x2fa878Ab3F87CC1C9737Fc071108F904c0B0C95d",
    img: inc,
    title: "INC",
    subtitle: "Incentive",
    value: "0.00",
    price: "0.00",
  },
  {
    address: "0x0Cb6F5a34ad42ec934882A05265A7d5F59b51A2f",
    img: usdt,
    title: "USDT",
    subtitle: "USDT From Ethereum",
    value: "0.00",
    price: "0.00",
  },
  {
    address: "0x15D38573d2feeb82e7ad5187aB8c1D52810B1f07",
    img: usdc,
    title: "USDC",
    subtitle: "USDC From Ethereum",
    value: "0.00",
    price: "0.00",
  },
];
const data = [{}, {}, {}, {}, {}, {}];
export default ConvertSection;
