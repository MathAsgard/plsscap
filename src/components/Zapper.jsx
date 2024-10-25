import React, { useState, useEffect } from "react";
import dai from "../assets/img/token/dai.svg";
import inc from "../assets/img/token/inc.svg";
import pcap from "../assets/img/token/pcap.svg";
import pls from "../assets/img/token/pls.svg";
import plsx from "../assets/img/token/plsx.svg";
import usdc from "../assets/img/token/usdc.svg";
import usdt from "../assets/img/token/usdt.svg";
import weth from "../assets/img/token/weth.svg";
import toast from "react-hot-toast";
import CustomModal from "./CustomModal";
import CustomSelectTwo from "./CustomSelectTwo";
import {
  AngleDown,
  Calculator,
  ClearIcon,
  ExchangeBottomIcon,
  UrlIcon,
} from "./Icon";

import lpABI from "../config/abi/lpToken.json";
import SelectModal from "./SelectModal";
import BigNumber from "bignumber.js/bignumber";
import useInterval from "../hooks/useInterval";
import contracts from "../config/constants/contracts.js";
import {
  multicall,
  writeContract,
  fetchBalance,
  waitForTransaction,
} from "@wagmi/core";
import { useAccount } from "wagmi";
import CountdownCard from "../components/CountdownCard";
import CustomToast from "./CustomToast.jsx";

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

const Zapper = ({
  native,
  hideButtons,
  modalsOnly,
  zappedModalOpenFromHeader,
  setZappedModalOpenFromHeader,
  objectToFilter,
  active,
  search,
  stakedOnly,
  index,
  dropdown,
  ...farm
}) => {
  /* 	const [staked, setStaked] = React.useState(false); */
  const [open, setOpen] = React.useState(false);
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [amountInput, setAmountInput] = React.useState(0);
  const [stockInput, setStockInput] = React.useState(0);
  const [lpBalance, setLpBalance] = React.useState(new BigNumber(0));
  const [stockBalance, setStockBalance] = React.useState(new BigNumber(0));
  const [stockPrice, setStockPrice] = React.useState(0);
  const [approved, setApproved] = React.useState(false);
  const [lockInput, setLockInput] = React.useState(0);
  const [zappedModal, setZappedModal] = React.useState(false);
  const [slippage, setSlippage] = React.useState(1);
  const [zapper, setZapper] = React.useState(0);

  const [selectedToken, setSelectedToken] = React.useState(0);
  // selectbox
  const [activeToken, setActiveToken] = React.useState(
    selectOptions[activeIndex]
  );
  const handleSelect = (index) => {
    if (index || index === 0) {
      setActiveIndex(index);
      setOpen(!open);
      setActiveToken(selectOptions[index]);
    } else {
      setOpen(!open);
    }
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
      ],
    });
    const _stockBalance = new BigNumber(
      _userStockBalance.result ? _userStockBalance.result : 0
    ).div(1e18);
    setStockBalance(_stockBalance);
    if (activeIndex !== 0) {
      const _lpBalance = new BigNumber(
        _userLpBalance.result ? _userLpBalance.result : 0
      ).div(1e18);
      setLpBalance(_lpBalance);
      const _approved = new BigNumber(_allowance.result).greaterThan(
        _lpBalance.mul(1e18)
      );
      setApproved(_approved);
    } else {
      const _lpBalance = new BigNumber(
        _userLpBalance.result ? _userLpBalance.result : 0
      ).div(1e18);
      setLpBalance(_lpBalance);
      setApproved(true);
    }
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

  useEffect(() => {
    getStats();
    getTokenBalances();
  }, []);

  useInterval(() => {
    getStats();
    getTokenBalances();
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
      const { hash } = await writeContract({
        address: selectOptions[activeIndex].address,
        abi: lpABI,
        functionName: "approve",
        account: userAccount.address,
        args: [contracts.zapper.address, lpBalance.mul(1e18).add(1)],
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
          title={`${selectOptions[activeIndex].title} Contract Approved`}
          description={<></>}
          hash={hash}
        />
      ));
      getStats();
    } catch (error) {
      toast.custom((t) => <CustomToast toast={toast} t={t} type={"failed"} />);
    }
  }

  async function convert() {
    try {
      const amountToZap = new BigNumber(amountInput.toString())
        .times(1e18)
        .toString()
        .split(".")[0];

      if (outputOptions[selectedIndex].stock === true) {
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
              title={"ZAPPED!"}
              description={
                <div className="font-[500] leading-[17px] text-[16px] mt-2">
                  You Zapped{" "}
                  <span className="text-[#01BCFF]">
                    {amountInput.toString()} PLS
                  </span>{" "}
                  to{" "}
                  <span className="text-[#01BCFF]">
                    {outputOptions[selectedIndex].label}
                  </span>
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
              title={"ZAPPED!"}
              description={
                <div className="font-[500] leading-[17px] text-[16px] mt-2">
                  You Zapped{" "}
                  <span className="text-[#01BCFF]">
                    {amountInput.toString()} PLS
                  </span>{" "}
                  to{" "}
                  <span className="text-[#01BCFF]">
                    {outputOptions[selectedIndex].label}
                  </span>
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
            functionName: "swapAndLiquifyETHOther",
            account: userAccount.address,
            args: [outputOptions[selectedIndex].address, 10],
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
              title={"ZAPPED!"}
              description={
                <div className="font-[500] leading-[17px] text-[16px] mt-2">
                  You Zapped{" "}
                  <span className="text-[#01BCFF]">
                    {amountInput.toString()} PLS
                  </span>{" "}
                  to{" "}
                  <span className="text-[#01BCFF]">
                    {outputOptions[selectedIndex].label}
                  </span>
                </div>
              }
              hash={hash}
            />
          ));
        } else {
          const tx = writeContract({
            ...contracts.zapper,
            functionName: "swapAndLiquifyTokenOther",
            account: userAccount.address,
            args: [
              selectOptions[activeIndex].address,
              amountToZap,
              outputOptions[selectedIndex].address,
              0,
            ],
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
              title={"ZAPPED!"}
              description={
                <div className="font-[500] leading-[17px] text-[16px] mt-2">
                  You Zapped{" "}
                  <span className="text-[#01BCFF]">
                    {amountInput.toString()} PLS
                  </span>{" "}
                  to{" "}
                  <span className="text-[#01BCFF]">
                    {outputOptions[selectedIndex].label}
                  </span>
                </div>
              }
              hash={hash}
            />
          ));
        }
      }
    } catch (error) {
      toast.custom((t) => <CustomToast toast={toast} t={t} type={"failed"} />);
    }

    getStats();
  }

  return (
    <>
      {/* Zapped Modal */}
      <CustomModal
        open={zappedModal || zappedModalOpenFromHeader}
        setOpen={() => {
          setZappedModalOpenFromHeader(false);
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
                <button
                  type="button"
                  onClick={() => setZappedModalOpenFromHeader(false)}
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
                          placeholder="0.00"
                          value={amountInput}
                          onChange={(e) => {
                            var val = e.target.value.replace(/\,/g, "");
                            setAmountInput(val);
                          }}
                        />
                        <div className="text-white text-opacity-50 text-sm font-medium text-left">
                          $
                          {toLocaleString(
                            amountInput * selectOptions[activeIndex].price,
                            2,
                            2
                          )}
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
                      <span>
                        {toLocaleString(selectOptions[activeIndex].value)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="my-[15px] flex justify-between flex-wrap gap-4 items-center">
                  <div className="flex flex-wrap gap-1">
                    <button
                      className={`day-btn ${zapper === 25 ? "active" : ""}`}
                      onClick={() => {
                        setZapper(25);
                        setAmountInput(
                          new BigNumber(selectOptions[activeIndex].value).div(4)
                        );
                      }}
                      type="button"
                    >
                      25%
                    </button>
                    <button
                      className={`day-btn ${zapper === 50 ? "active" : ""}`}
                      onClick={() => {
                        setZapper(50);
                        setAmountInput(
                          new BigNumber(selectOptions[activeIndex].value).div(2)
                        );
                      }}
                      type="button"
                    >
                      50%
                    </button>
                    <button
                      className={`day-btn ${zapper === 75 ? "active" : ""}`}
                      onClick={() => {
                        setZapper(75);
                        setAmountInput(
                          new BigNumber(selectOptions[activeIndex].value)
                            .div(4)
                            .times(3)
                        );
                      }}
                      type="button"
                    >
                      75%
                    </button>
                    <button
                      className={`day-btn ${zapper === 100 ? "active" : ""}`}
                      onClick={() => {
                        setZapper(100);
                        setAmountInput(
                          new BigNumber(selectOptions[activeIndex].value)
                        );
                      }}
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
                      value={slippage}
                      onChange={(e) => {
                        if (e.target.value >= 100) {
                          setSlippage(100);
                        } else {
                          setSlippage(e.target.value);
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
                        dropDownFilter={() => {}}
                        setSelectedIndex={setSelectedIndex}
                        options={outputOptions}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-evenly mb-8 md:mb-[43px]">
                  <button
                    type="button"
                    className="h-[45px] sm:font-bold mt-[15px] px-4 sm:w-full max-w-[142px] bg-transparent text-white text-opacity-50 rounded-[5px] border border-white border-opacity-50"
                    onClick={() => {
                      setZappedModalOpenFromHeader(false);
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn-3 h-[45px] sm:font-bold mt-[15px] px-4 sm:w-full max-w-[142px]"
                    onClick={() => {
                      /* 
											setStaked(true); */
                      setZappedModal(false);
                      approved === true ? convert() : approve();
                    }}
                  >
                    {approved === true ? "ZAP" : "APPROVE"}
                  </button>
                </div>
                {/* <div className="text-center text-white mb-5">
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
                </div> */}
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
export const outputOptions = [
  {
    stock: true,
    value: "STOCK Token",
    label: "STOCK Token",
  },
  {
    address: "0xE56043671df55dE5CDf8459710433C10324DE0aE",
    value: "eDAI-WPLS LP Token",
    label: "eDAI-WPLS LP Token",
  },
  {
    address: "0x6753560538ECa67617A9Ce605178F788bE7E524E",
    value: "eUSDC-WPLS LP Token",
    label: "eUSDC-WPLS LP Token",
  },
  {
    address: "0x1b45b9148791d3a104184Cd5DFE5CE57193a3ee9",
    value: "PLSX-WPLS LP Token",
    label: "PLSX-WPLS LP Token",
  },
];
export default Zapper;
