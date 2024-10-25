import React, { useEffect, useState } from "react";
import RangeSlider from "react-range-slider-input";
import "react-range-slider-input/dist/style.css";
import { Link } from "react-router-dom";
import CountdownCard from "../../../components/CountdownCard";
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
import lpABI from "../../../config/abi/lpToken.json";
import toast from "react-hot-toast";
import StockVaultCard from "./StockVaultCard";
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

const StockVaultSection = ({ homepage }) => {
  const [open, setOpen] = React.useState(false);
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [amountInput, setAmountInput] = React.useState(0);
  const [stockBalance, setStockBalance] = React.useState(new BigNumber(0));
  const [stockPrice, setStockPrice] = React.useState(0);
  const [dividendPool, setDividendPool] = React.useState(new BigNumber(0));
  const [pendingRewards, setPendingRewards] = React.useState(new BigNumber(0));
  const [userStaked, setUserStaked] = React.useState(new BigNumber(0));
  const [totalStaked, setTotalStaked] = React.useState(new BigNumber(0));
  const [approved, setApproved] = React.useState(false);
  const [view, setView] = React.useState("list");
  const [zappedModalOpenFromHeader, setZappedModalOpenFromHeader] =
    React.useState(false);
  const [userStakes, setUserStakes] = React.useState([]);
  const handleMobile = () => {
    if (window.innerWidth < 768) {
      setView("grid");
    }
  };
  React.useEffect(() => {
    handleMobile();
    window.addEventListener("resize", handleMobile);
    return () => window.removeEventListener("resize", handleMobile);
  }, []);

  const userAccount = useAccount({
    onConnect() {
      //setConnected(true)
    },
    onDisconnect() {
      //setConnected(false)
    },
  });

  async function getStats() {
    const [
      _userStockBalance,
      _allowanceStock,
      _daiPlsReserves,
      _daiPlsSupply,
      _userStakes,
      _dividendPool,
      _pendingRewards,
      _totalStaked,
      _userStats,
    ] = await multicall({
      contracts: [
        {
          ...contracts.stockToken,
          functionName: "balanceOf",
          args: [userAccount.address],
        },
        {
          ...contracts.stockToken,
          functionName: "allowance",
          args: [userAccount.address, contracts.stockPool.address],
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
        {
          ...contracts.stockPool,
          functionName: "userStakesArray",
          args: [userAccount.address],
        },
        {
          ...contracts.stockPool,
          functionName: "dividendPool",
          args: [],
        },
        {
          ...contracts.stockPool,
          functionName: "estimateDividendsOf",
          args: [userAccount.address, false],
        },
        {
          ...contracts.stockPool,
          functionName: "sharesSupply",
          args: [],
        },
        {
          ...contracts.stockPool,
          functionName: "userStats",
          args: [userAccount.address],
        },
      ],
    });

    /*{
			stake: "10,000",
			stakeAmount: "$6,303.12",
			duration: "5000 Days",
			countDown: "June 30, 2024 00:00:00",
			shares: "123,485.54",
			shareBonus: "+25% Bonus",
			rewards: "1,826 LP",
			rewards2: "$1,236.44",
			daysLeft: "0 Days",
			daysLeft2: "100%",
		},
		{active: true, amount: 1000000000000000000n, shares: 4000000000000000000n, timestamp: 1722479165n, duration: 8640000n}
		*/
    const _plsPrice = await getPlsPrice();
    const _stockBalance = new BigNumber(
      _userStockBalance.result ? _userStockBalance.result : 0
    ).div(1e18);
    setStockBalance(_stockBalance);
    const _approved = new BigNumber(_allowanceStock.result).greaterThan(
      _stockBalance.mul(1e18)
    );
    setApproved(_approved);
    const _stockPrice =
      (Number(_daiPlsReserves.result[0]) * Number(_plsPrice) +
        Number(_daiPlsReserves.result[1])) /
      Number(_daiPlsSupply.result);
    setStockPrice(_stockPrice);
    const filteredUserStakes = _userStakes.result
      .map((item, index) => {
        return { ...item, stakeId: index };
      })
      .filter((e) => e.active)
      .reverse();
    setUserStakes(filteredUserStakes);
    console.log(filteredUserStakes);
    setDividendPool(new BigNumber(_dividendPool.result));
    setPendingRewards(new BigNumber(_pendingRewards.result));
    setTotalStaked(new BigNumber(_totalStaked.result));
    // tokens === setUserStaked(new BigNumber((Number(_userStats.result[2])-Number(_userStats.result[3])).toString().split('.')[0]))
    setUserStaked(new BigNumber(_userStats.result[0]));
  }

  async function getPlsPrice() {
    const response = await fetch(
      `https://api.dexscreener.com/latest/dex/pairs/pulsechain/0xe56043671df55de5cdf8459710433c10324de0ae`
    );
    const rsps = await response.json();
    console.log(rsps);
    return rsps.pairs[0].priceUsd;
  }

  const [activeDay, setActiveDay] = React.useState(7);
  const [slideTouch, setSlideTouch] = React.useState(true);
  useEffect(() => {
    getStats();
  }, []);

  useInterval(() => {
    getStats();
  }, 5000);

  async function approve() {
    try {
      toast.custom((t) => (
        <CustomToast
          toast={toast}
          t={t}
          type={"pending"}
          description={"Awaiting for approval..."}
        />
      ));
      const tx = writeContract({
        address: contracts.stockToken.address,
        abi: lpABI,
        functionName: "approve",
        account: userAccount.address,
        args: [contracts.stockPool.address, stockBalance.mul(1e18).add(1)],
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
          title={`Contract Approved`}
          description={<></>}
          hash={hash}
        />
      ));
      getStats();
    } catch (error) {
      toast.custom((t) => <CustomToast toast={toast} t={t} type={"failed"} />);
    }
  }

  async function unstake(stakeId) {
    const tx = writeContract({
      ...contracts.stockPool,
      functionName: "unstake",
      account: userAccount.address,
      args: [stakeId],
    });
    toast.promise(tx, {
      loading: "Awaiting for approval...",
      success: <b>Transaction submited!</b>,
      error: <b>Error, please try again.</b>,
    });
    const { hash } = await tx;
    await waitForTransaction({
      hash,
    });
    getStats();
  }

  async function stake() {
    try {
      const amount = new BigNumber(amountInput.toString())
        .times(1e18)
        .toString()
        .split(".")[0];
      const duration = activeDay * 86400;
      toast.custom((t) => (
        <CustomToast
          toast={toast}
          t={t}
          type={"pending"}
          description={"Awaiting for approval..."}
        />
      ));
      const tx = writeContract({
        ...contracts.stockPool,
        functionName: "stake",
        account: userAccount.address,
        args: [amount, duration],
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

  async function withdraw() {
    try {
      const amount = new BigNumber(amountInput.toString())
        .times(1e18)
        .toString()
        .split(".")[0];
      const duration = activeDay * 86400;
      toast.custom((t) => (
        <CustomToast
          toast={toast}
          t={t}
          type={"pending"}
          description={"Awaiting for approval..."}
        />
      ));
      const tx = writeContract({
        ...contracts.stockPool,
        functionName: "withdraw",
        account: userAccount.address,
        args: [],
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

  if (homepage === true)
    return (
      <div className="asset-card h-full bg-stockvoult">
        <div className="inner">
          <img
            src="/img/asset-card-shape.png"
            className="absolute top-0 right-0 w-full rounded-[10px] blur-[75px]"
            alt=""
          />
          <div className="py-6 md:py-7 h-full relative z-[11]">
            <h5 className="text-md sm:text-lg font-semibold flex items-center gap-5 flex-grow mb-4 px-4 xl:pl-[39px] pr-0">
              <div>Vault Stats</div>
              <span className="w-0 flex-grow bg-gradient8 h-[1px]"></span>
            </h5>
            <div className="flex flex-wrap px-4 xl:px-[39px] gap-5 md:gap-[27px] md:gap-y-[17px]">
              <div className="w-full sm:w-[calc(50%-10px)] md:w-[calc(50%-14px)]">
                <div className="font-medium text-center leading-[19px] mb-[6px]">
                  Reward Pool
                </div>
                <div className="asset-card">
                  <div className="rounded-[10px] bg-[#140236] text-center h-full">
                    <div className="pt-4 pb-2 text-md sm:text-lg font-semibold px-3">
                      {toLocaleString(Number(dividendPool) / 1e18, 2, 2)}
                    </div>
                    <div className="text-sm sm:text-normal text-white text-opacity-50 border-t border-white border-opacity-20 py-1 px-3">
                      $
                      {toLocaleString(
                        (Number(dividendPool) / 1e18) * stockPrice,
                        2,
                        2
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full sm:w-[calc(50%-10px)] md:w-[calc(50%-14px)]">
                <div className="font-medium text-center leading-[19px] mb-[6px]">
                  Your Pending Rewards
                </div>
                <div className="asset-card">
                  <div className="rounded-[10px] bg-[#140236] text-center h-full">
                    <div className="pt-4 pb-2 text-md sm:text-lg font-semibold px-3">
                      {toLocaleString(Number(pendingRewards) / 1e18, 2, 2)}
                    </div>
                    <div className="text-sm sm:text-normal text-white text-opacity-50 border-t border-white border-opacity-20 py-1 px-3">
                      $
                      {toLocaleString(
                        (Number(pendingRewards) / 1e18) * stockPrice
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full sm:w-[calc(50%-10px)] md:w-[calc(50%-14px)]">
                <div className="font-medium text-center leading-[19px] mb-[6px]">
                  Total Stock Staked
                </div>
                <div className="asset-card">
                  <div className="rounded-[10px] bg-[#140236] text-center h-full">
                    <div className="pt-4 pb-2 text-md sm:text-lg font-semibold px-3">
                      {toLocaleString(Number(totalStaked) / 1e18, 2, 2)}
                    </div>
                    <div className="text-sm sm:text-normal border-t border-white border-opacity-20 py-1 px-3">
                      <div className="text-gradient-3">
                        $
                        {toLocaleString(
                          (Number(totalStaked) / 1e18) * stockPrice
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full sm:w-[calc(50%-10px)] md:w-[calc(50%-14px)]">
                <div className="font-medium text-center leading-[19px] mb-[6px]">
                  Your Shares
                </div>
                <div className="asset-card">
                  <div className="rounded-[10px] bg-[#140236] text-center h-full">
                    <div className="pt-4 pb-2 text-md sm:text-lg font-semibold px-3">
                      {toLocaleString(Number(userStaked) / 1e18, 2, 2)}
                    </div>
                    <div className="text-sm sm:text-normal text-white text-opacity-50 border-t border-white border-opacity-20 py-1 px-3">
                      $
                      {toLocaleString((Number(userStaked) / 1e18) * stockPrice)}
                    </div>
                  </div>
                </div>
              </div>
              <button
                type="button"
                className="btn-3 w-full h-[45px] sm:text-lg sm:font-bold"
                onClick={() => {
                  withdraw();
                }}
              >
                Claim Rewards
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  return (
    <>
      <section className="pt-[96px] pb-[78px] relative">
        <div className="w-full max-w-[1091px] h-[386px] blur-[200px] opacity-30 bg-gradient7 absolute left-1/2 -translate-x-1/2" />
        <div className="container xl:max-w-[1153px] relative z-10">
          <div className="flex flex-wrap gap-y-5 items-end gap-x-5">
            <h5 className="text-2xl sm:text-[40px] font-medium flex items-center gap-5 flex-grow mb-1">
              <div>Stock Vault</div>
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
          <div className="grid lg:grid-cols-2 gap-5 mt-4">
            <div className="asset-card h-full bg-stockvoult">
              <div className="inner bg-[#1C0050]">
                <img
                  src="/img/asset-card-shape.png"
                  className="absolute top-0 right-0 w-[75%] rounded-[10px] blur-[75px]"
                  alt=""
                />
                <div className="py-6 md:py-7 h-full relative z-[11]">
                  <h5 className="text-md sm:text-lg font-semibold flex items-center gap-5 flex-grow mb-8 px-4 xl:pl-[39px] pr-0">
                    <div>Stake Tokens</div>
                    <span className="w-0 flex-grow bg-gradient8 h-[1px]"></span>
                  </h5>
                  <div className="px-4 xl:px-[39px] gap-5 md:gap-[27px] md:gap-y-[17px]">
                    <div className="asset-card shadow-none">
                      <div className="rounded-[10px] bg-[#140236] text-center h-full">
                        <div className="flex justify-between items-center">
                          <div className="pt-4 pb-2 px-[14px] w-0 flex-grow">
                            <input
                              type="number"
                              className="w-full text-md sm:text-lg font-semibold bg-transparent border-0 outline-none text-left text-white placeholder:text-white"
                              placeholder="0.0"
                              value={amountInput}
                              onChange={(e) => {
                                var val = e.target.value.replace(/\,/g, "");
                                setAmountInput(val);
                              }}
                            />
                            <div className="text-white text-opacity-50 text-sm font-bold text-left">
                              ${toLocaleString(amountInput * stockPrice, 2, 2)}
                            </div>
                          </div>
                          <div className="text-md sm:text-lg font-semibold pr-5">
                            STOCK
                          </div>
                        </div>
                        <div className="text-sm text-white text-opacity-30 border-t border-white border-opacity-20 py-1 mx-[14px] flex justify-between font-medium">
                          <span>Wallet Balance</span>
                          <span
                            onClick={() => {
                              setAmountInput(stockBalance);
                            }}
                          >
                            {toLocaleString(stockBalance, 2, 2)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="my-[15px] flex justify-between flex-wrap gap-4 items-center">
                      <div className="flex flex-wrap gap-1">
                        <button
                          className={`day-btn ${
                            amountInput.toString() ===
                              stockBalance.div(4).toString() &&
                            stockBalance.greaterThan(0)
                              ? "active"
                              : ""
                          }`}
                          onClick={() =>
                            setAmountInput(stockBalance.div(4).toString())
                          }
                          type="button"
                        >
                          25%
                        </button>
                        <button
                          className={`day-btn ${
                            amountInput.toString() ===
                              stockBalance.div(2).toString() &&
                            stockBalance.greaterThan(0)
                              ? "active"
                              : ""
                          }`}
                          onClick={() =>
                            setAmountInput(stockBalance.div(2).toString())
                          }
                          type="button"
                        >
                          50%
                        </button>
                        <button
                          className={`day-btn ${
                            amountInput.toString() ===
                              stockBalance.div(4).mul(3).toString() &&
                            stockBalance.greaterThan(0)
                              ? "active"
                              : ""
                          }`}
                          onClick={() =>
                            setAmountInput(stockBalance.div(4).mul(3))
                          }
                          type="button"
                        >
                          75%
                        </button>
                        <button
                          className={`day-btn ${
                            amountInput.toString() ===
                              stockBalance.toString() &&
                            stockBalance.greaterThan(0)
                              ? "active"
                              : ""
                          }`}
                          onClick={() => setAmountInput(stockBalance)}
                          type="button"
                        >
                          MAX
                        </button>
                      </div>
                    </div>
                    <div className="font-medium text-center text-white text-opacity-50 mt-1">
                      Select Stake Duration
                    </div>
                    <div className="flex gap-2 items-center">
                      <button className="day-btn" type="button">
                        1 day
                      </button>
                      <div className="w-0 flex-grow">
                        <RangeSlider
                          className="single-thumb"
                          defaultValue={[1, activeDay]}
                          thumbsDisabled={[true, false]}
                          rangeSlideDisabled={true}
                          max={100}
                          min={1}
                          onInput={(value) => {
                            setActiveDay(value[1]);
                            setSlideTouch(true);
                          }}
                        />
                      </div>
                      <button className="day-btn" type="button">
                        100 days
                      </button>
                    </div>

                    <div className="my-[15px] flex justify-between flex-wrap gap-4 items-center">
                      <div className="flex flex-wrap gap-1">
                        <button
                          className={`day-btn ${
                            activeDay === 25 ? "active" : ""
                          }`}
                          onClick={() => setActiveDay(25)}
                          type="button"
                        >
                          25d
                        </button>
                        <button
                          className={`day-btn ${
                            activeDay === 50 ? "active" : ""
                          }`}
                          onClick={() => setActiveDay(50)}
                          type="button"
                        >
                          50d
                        </button>
                        <button
                          className={`day-btn ${
                            activeDay === 75 ? "active" : ""
                          }`}
                          onClick={() => setActiveDay(75)}
                          type="button"
                        >
                          75d
                        </button>
                        <button
                          className={`day-btn ${
                            activeDay === 100 ? "active" : ""
                          }`}
                          onClick={() => setActiveDay(100)}
                          type="button"
                        >
                          100d
                        </button>
                      </div>

                      <div className="flex gap-4 items-center text-sm font-medium text-white text-opacity-50 bg-[#150238] py-1 px-4 rounded-[5px]">
                        <span>Bonus Share: </span>
                        <span className="text-gradient-3">
                          {activeDay * 3}%
                        </span>
                      </div>
                      {slideTouch ? (
                        <button
                          className={`day-btn`}
                          type="button"
                          style={{ border: "solid white 1px" }}
                        >
                          {activeDay} days
                        </button>
                      ) : (
                        ""
                      )}
                    </div>
                    <button
                      type="button"
                      className="btn-3 w-full h-[45px] sm:text-lg sm:font-bold mt-[15px]"
                      onClick={() => {
                        approved ? stake() : approve();
                      }}
                    >
                      {approved ? "Stake" : "Approve"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="asset-card h-full bg-stockvoult">
              <div className="inner">
                <img
                  src="/img/asset-card-shape.png"
                  className="absolute top-0 right-0 w-full rounded-[10px] blur-[75px]"
                  alt=""
                />
                <div className="py-6 md:py-7 h-full relative z-[11]">
                  <h5 className="text-md sm:text-lg font-semibold flex items-center gap-5 flex-grow mb-4 px-4 xl:pl-[39px] pr-0">
                    <div>Vault Stats</div>
                    <span className="w-0 flex-grow bg-gradient8 h-[1px]"></span>
                  </h5>
                  <div className="flex flex-wrap px-4 xl:px-[39px] gap-5 md:gap-[27px] md:gap-y-[17px]">
                    <div className="w-full sm:w-[calc(50%-10px)] md:w-[calc(50%-14px)]">
                      <div className="font-medium text-center leading-[19px] mb-[6px]">
                        Reward Pool
                      </div>
                      <div className="asset-card">
                        <div className="rounded-[10px] bg-[#140236] text-center h-full">
                          <div className="pt-4 pb-2 text-md sm:text-lg font-semibold px-3">
                            {toLocaleString(Number(dividendPool) / 1e18, 2, 2)}
                          </div>
                          <div className="text-sm sm:text-normal text-white text-opacity-50 border-t border-white border-opacity-20 py-1 px-3">
                            $
                            {toLocaleString(
                              (Number(dividendPool) / 1e18) * stockPrice,
                              2,
                              2
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="w-full sm:w-[calc(50%-10px)] md:w-[calc(50%-14px)]">
                      <div className="font-medium text-center leading-[19px] mb-[6px]">
                        Your Pending Rewards
                      </div>
                      <div className="asset-card">
                        <div className="rounded-[10px] bg-[#140236] text-center h-full">
                          <div className="pt-4 pb-2 text-md sm:text-lg font-semibold px-3">
                            {toLocaleString(
                              Number(pendingRewards) / 1e18,
                              2,
                              2
                            )}
                          </div>
                          <div className="text-sm sm:text-normal text-white text-opacity-50 border-t border-white border-opacity-20 py-1 px-3">
                            $
                            {toLocaleString(
                              (Number(pendingRewards) / 1e18) * stockPrice
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="w-full sm:w-[calc(50%-10px)] md:w-[calc(50%-14px)]">
                      <div className="font-medium text-center leading-[19px] mb-[6px]">
                        Total Shares Staked
                      </div>
                      <div className="asset-card">
                        <div className="rounded-[10px] bg-[#140236] text-center h-full">
                          <div className="pt-4 pb-2 text-md sm:text-lg font-semibold px-3">
                            {toLocaleString(Number(totalStaked) / 1e18, 2, 2)}
                          </div>
                          <div className="text-sm sm:text-normal border-t border-white border-opacity-20 py-1 px-3">
                            <div className="text-gradient-3">
                              $
                              {toLocaleString(
                                (Number(totalStaked) / 1e18) * stockPrice
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="w-full sm:w-[calc(50%-10px)] md:w-[calc(50%-14px)]">
                      <div className="font-medium text-center leading-[19px] mb-[6px]">
                        Your Shares Staked
                      </div>
                      <div className="asset-card">
                        <div className="rounded-[10px] bg-[#140236] text-center h-full">
                          <div className="pt-4 pb-2 text-md sm:text-lg font-semibold px-3">
                            {toLocaleString(Number(userStaked) / 1e18, 2, 2)}
                          </div>
                          <div className="text-sm sm:text-normal text-white text-opacity-50 border-t border-white border-opacity-20 py-1 px-3">
                            $
                            {toLocaleString(
                              (Number(userStaked) / 1e18) * stockPrice
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="btn-3 w-full h-[45px] sm:text-lg sm:font-bold"
                      onClick={() => {
                        withdraw();
                      }}
                    >
                      Claim Rewards
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="relative z-[99]">
        <div className="noisy-bg top-[-100px]" />
        <div className="container xl:max-w-[1330px] relative z-10">
          <div className="xl:max-w-[1130px] mx-auto">
            <div className="mb-4 sm:mb-[38px]">
              <div className="flex flex-wrap gap-5">
                <h5 className="text-2xl sm:text-[40px] font-medium flex items-center gap-5 flex-grow">
                  <div>My Vault</div>
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
          </div>
          {view === "list" ? (
            // <div className="xl:max-w-[1130px] mx-auto">

            <div className="relative z-10 rounded-t-none rounded-b-[10px]">
              {/* <div className="gradient-border bg-tableGradient inset-[1px] top-[75px] z-10 before:h-[2px] before:w-full before:absolute before:left-0 before:top-[-1px] before:bg-tableBg" /> */}

              <div className="rounded-[10px] bg-tableBg overflow-hidden px-4 pb-4 xl:px-[43px] xl:pb-[43px] relative">
                <div
                  className="absolute left-0 right-0 bottom-0 top-[75px]"
                  style={{
                    background: `url('/img/table-overlay.png') no-repeat right top / cover`,
                  }}
                />
                <div className="gradient-border h-full max-h-[675px] bg-gradient9" />
                <div className="overflow-x-auto">
                  <table className="custom-table">
                    <thead>
                      <tr className="font-semibold md:text-lg">
                        <th className="p-4 text-nowrap">Stake</th>
                        <th className="p-4 text-nowrap">Duration</th>
                        <th className="p-4 text-nowrap">Shares</th>
                        <th className="p-4 text-nowrap">Days Left</th>
                        <th className="p-4 text-nowrap">Action</th>
                      </tr>
                      <tr>
                        <th className="md:p-4"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {userStakes.map((item, index) => (
                        <tr className="text-center" key={index}>
                          <td className="custom-table-td py-2">
                            <div className="font-semibold">
                              {toLocaleString(Number(item.amount) / 1e18, 2, 2)}{" "}
                              STOCK
                            </div>
                            <span className="text-gradient-3 text-sm">
                              $
                              {toLocaleString(
                                (Number(item.amount) / 1e18) * stockPrice,
                                2,
                                2
                              )}
                            </span>
                          </td>
                          <td className="custom-table-td py-2">
                            <div className="font-semibold text-blue uppercase">
                              {
                                (Number(item.duration) / 86400)
                                  .toString()
                                  .split(".")[0]
                              }{" "}
                              DAYS
                            </div>
                            <span className="text-sm text-white text-opacity-50 min:w-[155px]">
                              <CountdownCard
                                targetDate={
                                  new Date(
                                    (Number(item.timestamp) +
                                      Number(item.duration)) *
                                      1000
                                  )
                                }
                                shortend={true}
                                showDays={true}
                              />
                            </span>
                          </td>
                          <td className="custom-table-td py-2">
                            <div className="font-semibold">
                              {toLocaleString(Number(item.shares) / 1e18, 2, 2)}
                            </div>
                            <span className="text-white text-opacity-50 text-sm">
                              +{(Number(item.duration) / 86400) * 3}% Bonus
                            </span>
                          </td>
                          <td className="custom-table-td py-2">
                            <div className="font-semibold">
                              {
                                (
                                  (Number(item.timestamp) +
                                    Number(item.duration) -
                                    Date.now() / 1000) /
                                  86400
                                )
                                  .toString()
                                  .replace("-", "")
                                  .split(".")[0]
                              }{" "}
                              DAYS
                            </div>
                            <span className="text-gradient-3 uppercase text-sm">
                              {((Number(item.duration) -
                                (Number(item.timestamp) +
                                  Number(item.duration) -
                                  Date.now() / 1000)) /
                                Number(item.duration)) *
                                100 <=
                              100
                                ? toLocaleString(
                                    ((Number(item.duration) -
                                      (Number(item.timestamp) +
                                        Number(item.duration) -
                                        Date.now() / 1000)) /
                                      Number(item.duration)) *
                                      100,
                                    2,
                                    2
                                  )
                                : "100.00"}{" "}
                              %
                            </span>
                          </td>
                          <td className="custom-table-td py-2">
                            <button
                              type="button"
                              className="stake-btn"
                              onClick={() => unstake(item.stakeId)}
                            >
                              Unstake
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {userStakes.map((item, index) => (
                <div className="" key={index}>
                  <StockVaultCard
                    item={item}
                    stockPrice={stockPrice}
                    unstake={unstake}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
      <Zapper
        zappedModalOpenFromHeader={zappedModalOpenFromHeader}
        setZappedModalOpenFromHeader={setZappedModalOpenFromHeader}
      />
    </>
  );
};

export default StockVaultSection;
export const data = [];
