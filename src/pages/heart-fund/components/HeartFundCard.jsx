import React, { useState, useEffect } from "react";
import CustomModal from "../../../components/CustomModal";
import {
  Calculator,
  ClearIcon,
  ExchangeBottomIcon,
  InfoIcon2,
  UrlIcon,
} from "../../../components/Icon";

import BigNumber from "bignumber.js/bignumber";
import useInterval from "../../../hooks/useInterval";
import contracts from "../../../config/constants/contracts.js";
import { multicall, writeContract, waitForTransaction } from "@wagmi/core";
import { useAccount } from "wagmi";
import lpABI from "../../../config/abi/lpToken.json";
import CustomToast from "../../../components/CustomToast.jsx";
import toast from "react-hot-toast";

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

const HeartFundCard = ({
  native,
  hideButtons,
  objectToFilter,
  active,
  search,
  stakedOnly,
  index,
  dropdown,
  ...farm
}) => {
  const [staked, setStaked] = React.useState(false);
  const [approved, setApproved] = React.useState(false);
  const [stockApproved, setStockApproved] = React.useState(false);

  const [lpdetailsOpen, setLpdetailsOpen] = React.useState(false);
  const [unstakeModalOpen, setUnStakeModalOpen] = React.useState(false);
  const [roiModalOpen, setRoiModalOpen] = React.useState(false);
  const [stakeModalOpen, setStakeModalOpen] = React.useState(false);
  const [stakeInfoModalOpen, setStakeInfoModalOpen] = React.useState(false);
  const [activeDay, setActiveDay] = React.useState("25%");
  const [activeDayStock, setActiveDayStock] = React.useState("25%");
  const [myStake, setMyStake] = React.useState("$100");
  const [dayStaked, setDayStaked] = React.useState("1DAY");

  const [stakeType, setStakeType] = React.useState("LP");
  const [unstakeType, setUnstakeType] = React.useState("LP");
  const [lpPrice, setLpPrice] = useState(0);
  const [stockPrice, setStockPrice] = useState(0);

  const [connected, setConnected] = React.useState(false);
  const [show, setShow] = React.useState(false);
  const [shakeModalShow, setShakeModalShow] = React.useState(null);
  const [detailsShow, setDetailsShow] = React.useState(false);
  const [staking, setStaking] = React.useState(false);
  const [stockBalance, setStockBalance] = React.useState(false);
  const [farmFees, setFarmFees] = useState(0);
  const [multiplier, setMultiplier] = useState(0);
  const [pendingPine, setPendingPine] = useState(0);
  const [pendingStock, setPendingStock] = useState(0);
  const [pendingPineUSD, setPendingPineUSD] = useState(0);
  const [totalLiquidity, setTotalLiquidity] = useState(0);
  const [stakedLpBalance, setStakedLpBalance] = useState(new BigNumber(0));
  const [stakedLpBalanceUSD, setStakedLpBalanceUSD] = useState(0);
  const [stakedStockBalance, setStakedStockBalance] = useState(
    new BigNumber(0)
  );
  const [stakedStockBalanceUSD, setStakedStockBalanceUSD] = useState(0);
  const [farmAPR, setFarmAPR] = useState(0);
  const [lpBalance, setLpBalance] = useState(new BigNumber(0));
  const [stakeInput, setStakeInput] = useState(new BigNumber(0));
  const [stockInput, setStockInput] = useState(new BigNumber(0));
  const [stockPerLP, setStockPerLP] = useState(new BigNumber(0));
  const [unstakeInput, setUnstakeInput] = useState(new BigNumber(0));
  const [unstakeInputStock, setUnstakeInputStock] = useState(new BigNumber(0));
  const [pineEarnedPerThousand1D, setPineEarnedPerThousand1D] = useState(0);
  const [pineEarnedPerThousand7D, setPineEarnedPerThousand7D] = useState(0);
  const [pineEarnedPerThousand30D, setPineEarnedPerThousand30D] = useState(0);
  const [pineEarnedPerThousand365D, setPineEarnedPerThousand365D] = useState(0);
  const [oneThousandDollarsWorthOfPine, setOneThousandDollarsWorthOfPine] =
    useState(0);
  const [masterLpBalance, setMasterLpBalance] = useState(0);
  const [farmROI, setFarmROI] = useState(0);
  const [reserver, setReserves] = useState(0);
  const [lpSupply, setLpSupply] = useState(0);
  const [pcapPrice, setPcapPrice] = useState(0);
  const [apr, setApr] = useState(0);
  const [calculatorAmountInput, setCalculatorAmountInput] = useState(0);

  const [token1, token2] = [
    farm?.lpSymbol?.split("-")[0] + ".png",
    farm?.lpSymbol?.split("-")[1] + ".png",
  ];
  const lpLink = `https://app.pulsex.com/add/V${farm?.version}/${farm?.quoteToken?.address}/${farm.token?.address}`;
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
    const SECONDS_PER_YEAR = 31536000;
    const yearlyPineRewardAllocation =
      PINE_PER_BLOCK * SECONDS_PER_YEAR * poolWeight;
    let apy =
      ((yearlyPineRewardAllocation * pinePrice) / poolLiquidityUsd) * 150;
    return apy;
  }
  function getDailyROI(
    poolWeight,
    pinePrice,
    poolLiquidityUsd,
    PINE_PER_BLOCK
  ) {
    const SECONDS_PER_DAY = 86400;
    const dailyPineRewardAllocation =
      PINE_PER_BLOCK * SECONDS_PER_DAY * poolWeight;
    let apy =
      ((dailyPineRewardAllocation * pinePrice) / poolLiquidityUsd) * 150;
    return apy;
  }
  async function getStats() {
    const query =
      "0x554dcc3dFD807ef343855837A404bF4dF6D8C7Ee, 0xf808Bb6265e9Ca27002c0A04562Bf50d4FE37EAA" +
      "," +
      farm.lpAddress;
    const response = await fetch(
      `https://api.dexscreener.com/latest/dex/pairs/pulsechain/${query}`
    );
    const rsps = await response.json();

    const pinePrice = rsps.pairs?.filter(
      (pair) =>
        pair.pairAddress === "0x554dcc3dFD807ef343855837A404bF4dF6D8C7Ee"
    )[0]?.priceUsd;
    const incPrice = rsps.pairs?.filter(
      (pair) =>
        pair.pairAddress === "0xf808Bb6265e9Ca27002c0A04562Bf50d4FE37EAA"
    )[0]?.priceUsd;
    const pairData = rsps.pairs?.filter(
      (pair) => pair.pairAddress === farm.lpAddress
    )[0];

    const [
      poolInfo,
      allowance,
      allowanceStock,
      pendingAtropine,
      _pendingStock,
      _lpSupply,
      masterchefLpBalance,
      userLpBalance,
      userStakedLp,
      totalAllocPoint,
      pinePerBlock,
      _stockBalance,
      _daiPlsReserves,
      _daiPlsSupply,
      _reserves,
      _totalAllocPointPlsx,
      incPerSecond,
      masterchefPLSXBalance,
      poolInfoPLSX,
    ] = await multicall({
      contracts: [
        {
          ...contracts.masterChefRh,
          functionName: "poolInfo",
          args: [farm.pid],
        },
        {
          address: farm.lpAddress,
          abi: lpABI,
          functionName: "allowance",
          args: [userAccount.address, contracts.masterChefRh.address],
        },
        {
          ...contracts.stockToken,
          functionName: "allowance",
          args: [userAccount.address, contracts.masterChefRh.address],
        },
        {
          ...contracts.masterChefRh,
          functionName: "pendingPcap",
          args: [farm.pid, userAccount.address],
        },
        {
          ...contracts.masterChefRh,
          functionName: "pendingStock",
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
          args: [farm.plsxPid, contracts.masterChefRh.address],
        },
        {
          address: farm.lpAddress,
          abi: lpABI,
          functionName: "balanceOf",
          args: [userAccount.address],
        },
        {
          ...contracts.masterChefRh,
          functionName: "userInfo",
          args: [farm.pid, userAccount.address],
        },
        {
          ...contracts.masterChefRh,
          functionName: "totalAllocPoint",
        },
        {
          ...contracts.masterChefRh,
          functionName: "PcapPerStock",
        },
        {
          ...contracts.stockToken,
          functionName: "balanceOf",
          args: [userAccount.address],
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
          address: farm.lpAddress,
          abi: lpABI,
          functionName: "getReserves",
        },
        {
          ...contracts.masterchefPLSX,
          functionName: "totalAllocPoint",
          args: [],
        },
        {
          ...contracts.masterchefPLSX,
          functionName: "incPerSecond",
          args: [],
        },
        {
          address: farm.lpAddress,
          abi: lpABI,
          functionName: "balanceOf",
          args: ["0xB2Ca4A66d3e57a5a9A12043B6bAD28249fE302d4"],
        },
        {
          ...contracts.masterchefPLSX,
          functionName: "poolInfo",
          args: [farm.plsxPid],
        },
      ],
    });
    const _plsPrice = await getPlsPrice();
    setLpSupply(Number(_lpSupply.result));
    const _stockPrice =
      (Number(_daiPlsReserves.result[0]) * Number(_plsPrice) +
        Number(_daiPlsReserves.result[1])) /
      Number(_daiPlsSupply.result);
    setStockPrice(_stockPrice);
    const _lpPrice =
      Number(pairData.liquidity.usd) / (Number(_lpSupply.result) / 1e18);
    setMasterLpBalance(masterchefLpBalance.result[0]);
    setLpPrice(_lpPrice);
    setReserves(_reserves.result);
    console.log(reserver, "res");
    const _poolWeight =
      Number(poolInfoPLSX.result[1]) / Number(_totalAllocPointPlsx.result);

    const _stockPerLP = Number(poolInfo.result[1]);
    setStockPerLP(new BigNumber(_stockPerLP).div(1e6));
    const _farmFees =
      Number(poolInfo.result[5]) > 0
        ? Number(poolInfo.result[4]) / 10000 + "% fees"
        : "No Fees";
    setStockBalance(new BigNumber(_stockBalance.result).div(1e18));
    setFarmFees(_farmFees);
    //const _multiplier = Number(poolInfo.result[1]) / 10 + 'x';
    setMultiplier("10x");

    console.log(pendingAtropine.result);
    const _pendingPine = Number(
      Number(pendingAtropine.result ? pendingAtropine.result : 0) / 1e18
    ).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    setPendingPine(_pendingPine);
    const __pendingStock = Number(
      Number(_pendingStock.result ? _pendingStock.result : 0) / 1e18
    ).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    setPendingStock(__pendingStock);
    const _pendingPineUSD = Number(
      (Number(pendingAtropine.result ? pendingAtropine.result : 0) / 1e18) *
        pinePrice
    ).toLocaleString(undefined, {
      minimumFractionDigits: 3,
      maximumFractionDigits: 3,
    });
    setPendingPineUSD(_pendingPineUSD);
    const _totalLiquidity = Number(
      _lpPrice * (Number(masterchefLpBalance.result[0]) / 1e18)
    ).toLocaleString(undefined, { maximumFractionDigits: 0 });
    setTotalLiquidity(_totalLiquidity);
    const _stakedLpBalance = new BigNumber(
      userStakedLp.result ? userStakedLp.result[0] : 0
    ).div(1e18);
    setStakedLpBalance(_stakedLpBalance);

    const _stakedStockBalance = new BigNumber(
      userStakedLp.result ? userStakedLp.result[1] : 0
    ).div(1e18);
    setStakedStockBalance(_stakedStockBalance);
    console.log(userStakedLp.result);
    const _staking =
      Number(Number(userStakedLp.result ? userStakedLp.result[0] : 0) / 1e18) >
      0;
    setStaking(_staking);
    const _stakedLpBalanceUSD = Number(
      (Number(userStakedLp.result ? userStakedLp.result[0] : 0) / 1e18) *
        _lpPrice
    ).toLocaleString(undefined, {
      minimumFractionDigits: 3,
      maximumFractionDigits: 3,
    });
    setStakedLpBalanceUSD(_stakedLpBalanceUSD);

    const _stakedStockBalanceUSD = Number(
      (Number(userStakedLp.result ? userStakedLp.result[1] : 0) / 1e18) *
        _stockPrice
    ).toLocaleString(undefined, {
      minimumFractionDigits: 3,
      maximumFractionDigits: 3,
    });
    setStakedStockBalanceUSD(_stakedStockBalanceUSD);

    const _lpBalance = new BigNumber(
      userLpBalance.result ? userLpBalance.result : 0
    ).div(1e18);
    setLpBalance(_lpBalance);

    const _approved = new BigNumber(allowance.result).greaterThan(
      _lpBalance.mul(1e18)
    );

    setApproved(_approved);

    const _approvedStock = new BigNumber(allowanceStock.result).greaterThan(
      new BigNumber(_stockBalance.result)
    );

    setStockApproved(_approvedStock);

    objectToFilter(farm.lpAddress, {
      pendingPine: Number(pendingAtropine.result) / 1e18,
      totalLiquidity:
        (Number(pairData.liquidity.usd) / (Number(_lpSupply.result) / 1e18)) *
        (Number(masterchefLpBalance.result) / 1e18),
      farmAPR: getFarmApy(
        _poolWeight,
        pinePrice,
        Number(_lpPrice * (Number(masterchefLpBalance.result) / 1e18)),
        Number(pinePerBlock.result) / 1e18
      ),
    });

    const _apr = toLocaleString(
      Number(
        getFarmApy(
          _poolWeight,
          incPrice,
          Number(_lpPrice * (Number(masterchefPLSXBalance.result) / 1e18)),
          Number(incPerSecond.result) / 1e18
        )
      ),
      2,
      2
    );
    setFarmAPR(_apr);
    const _farmROI = toLocaleString(
      Number(
        getDailyROI(
          _poolWeight,
          incPrice,
          Number(_lpPrice * (Number(masterchefPLSXBalance.result) / 1e18)),
          Number(incPerSecond.result) / 1e18
        )
      ),
      2,
      2
    );
    setFarmROI(_farmROI);
    setApr(_apr);
    setPcapPrice(pinePrice);
    const _pineEarnedPerThousand1D = calculatePineEarnedPerThousandDollars(
      1,
      _apr,
      pinePrice
    );
    setPineEarnedPerThousand1D(_pineEarnedPerThousand1D);
    const _pineEarnedPerThousand7D = calculatePineEarnedPerThousandDollars(
      7,
      _apr,
      pinePrice
    );
    setPineEarnedPerThousand7D(_pineEarnedPerThousand7D);
    const _pineEarnedPerThousand30D = calculatePineEarnedPerThousandDollars(
      30,
      _apr,
      pinePrice
    );
    setPineEarnedPerThousand30D(_pineEarnedPerThousand30D);
    const _pineEarnedPerThousand365D = calculatePineEarnedPerThousandDollars(
      365,
      _apr,
      pinePrice
    );
    setPineEarnedPerThousand365D(_pineEarnedPerThousand365D);

    const _oneThousandDollarsWorthOfPine = 1000 / pinePrice;
    setOneThousandDollarsWorthOfPine(_oneThousandDollarsWorthOfPine);
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
  async function getPlsPrice() {
    const response = await fetch(
      `https://api.dexscreener.com/latest/dex/pairs/pulsechain/0xe56043671df55de5cdf8459710433c10324de0ae`
    );
    const rsps = await response.json();
    console.log(rsps);
    return rsps.pairs[0].priceUsd;
  }
  useEffect(() => {
    getStats();
  }, []);
  useEffect(() => {
    getStats();
  }, [dropdown]);
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
        args: [contracts.masterChefRh.address, amount],
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
  async function approveStock() {
    try {
      const amount = stockBalance.mul(1e18).add(1);
      toast.custom((t) => (
        <CustomToast
          toast={toast}
          t={t}
          type={"pending"}
          description={"Awaiting for approval..."}
        />
      ));
      const { hash } = await writeContract({
        ...contracts.stockToken,
        functionName: "approve",
        account: userAccount.address,
        args: [contracts.masterChefRh.address, amount],
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
          title={`STOCK Contract Approved`}
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
        ...contracts.masterChefRh,
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
        ...contracts.masterChefRh,
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
  async function unstakeLp() {
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
        ...contracts.masterChefRh,
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

  function calculatePineEarnedPerThousandDollars(
    numberOfDays,
    farmApy,
    pinePrice
  ) {
    // Everything here is worked out relative to a year, with the asset compounding daily
    const timesCompounded = 365;
    //   We use decimal values rather than % in the math for both APY and the number of days being calculates as a proportion of the year
    const apyAsDecimal = farmApy / 100;
    const daysAsDecimalOfYear = numberOfDays / timesCompounded;
    //   Calculate the starting CAKE balance with a dollar balance of $1000.
    const principal = 1000 / pinePrice;

    // This is a translation of the typical mathematical compounding APY formula. Details here: https://www.calculatorsoup.com/calculators/financial/compound-interest-calculator.php
    const finalAmount =
      principal *
      (1 + apyAsDecimal / timesCompounded) **
        (timesCompounded * daysAsDecimalOfYear);

    // To get the pine earned, deduct the amount after compounding (finalAmount) from the starting CAKE balance (principal)
    const interestEarned = finalAmount - principal;
    return roundToTwoDp(interestEarned);
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
      <div
        className={`bg-gradient9 p-[1px] shadow-cardShadow rounded-t-[10px] ${
          staked ? "rounded-b-[10px]" : "rounded-[10px]"
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
                    v1
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
                  <span className="font-bold text-gradient-3">{farmROI}%</span>
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
            <div className="flex flex-wrap justify-between mt-4 gap-y-4">
              <div className="w-[calc(50%-10px)]">
                <div className="dashboard-card w-full max-w-full group">
                  <div className="__border" />
                  <div className="relative z-10">
                    <div className="-mb-2">
                      <h6 className="text-xs sm:text-sm font-semibold -translate-y-1/2 mx-4 m-0 text-opacity-50 text-white inline-flex items-center gap-1 bg-[#1C0050] px-2 xl:px-3">
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
                          {toLocaleString(stakedLpBalance, 2, 6, 0.01)}
                        </h2>
                        <p className="text-sm text-white text-opacity-50  py-[6px] leading-[19px] border-t border-white border-opacity-20">
                          ${toLocaleString(stakedLpBalanceUSD, 2, 2)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-[calc(50%-10px)]">
                <div className="dashboard-card w-full max-w-full group">
                  <div className="__border" />
                  <div className="relative z-10">
                    <div className="-mb-2">
                      <h6 className="text-xs sm:text-sm font-semibold -translate-y-1/2 mx-3 m-0 text-opacity-50 text-white inline-flex items-center gap-1 bg-[#1C0050] px-2">
                        <span className="group-hover:text-gradient-3">
                          Staked STOCK
                        </span>
                      </h6>
                    </div>
                    <div className="bg-gradient9 rounded-[5px] p-[1px]">
                      <div className="bg-[#150238] shadow-innerShadow rounded-[5px]">
                        <h2 className="text-lg font-semibold pt-3 pb-2">
                          {toLocaleString(stakedStockBalance, 2, 2)}
                        </h2>
                        <p className="text-sm text-white text-opacity-50 py-[6px] leading-[19px] border-t border-white border-opacity-20">
                          ${toLocaleString(stakedStockBalanceUSD, 2, 2)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-[calc(50%-10px)]">
                <div className="dashboard-card w-full max-w-full group">
                  <div className="__border border-white border-opacity-50" />
                  <div className="relative z-10">
                    <div className="-mb-2">
                      <h6 className="text-xs sm:text-sm font-semibold -translate-y-1/2 mx-4 m-0 text-opacity-50 text-white inline-flex items-center gap-1 bg-[#1C0050] px-3">
                        <span className="group-hover:text-gradient-3 text-gradient-3">
                          Stock Earned
                        </span>
                      </h6>
                    </div>
                    <div className="bg-gradient9 rounded-[5px] p-[1px]">
                      <div className="bg-[#150238] shadow-innerShadow rounded-[5px]">
                        <h2 className="text-lg font-semibold pt-[14px] pb-[12px]">
                          {toLocaleString(pendingStock, 2, 2)}
                        </h2>
                        <p className="text-sm text-white text-opacity-50 py-[8px] leading-[19px] border-t border-white border-opacity-20">
                          ${toLocaleString(pendingStock * stockPrice, 2, 2)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* <div className="w-[calc(50%-10px)]">
                <div className="dashboard-card w-full max-w-full group">
                  <div className="__border" />
                  <div className="relative z-10">
                    <div className="-mb-2">
                      <h6 className="text-xs sm:text-sm font-semibold -translate-y-1/2 mx-3 m-0 text-opacity-50 text-white inline-flex items-center gap-1 bg-[#1C0050] px-2">
                        <span className="group-hover:text-gradient-3">
                          Stake Ratio
                        </span>
                        <button
                          type="button"
                          onClick={() => setStakeInfoModalOpen(true)}
                        >
                          <InfoIcon2 />
                        </button>
                      </h6>
                    </div>
                    <div className="grid grid-cols-2 gap-[10px]">
                      <div>
                        <div className="bg-[#150238] shadow-innerShadow rounded-[5px] mb-[7px]">
                          <h2 className="text-lg font-semibold xl:text-xl text-gradient-5 leading-[30px] xl:leading-[30px]">
                            94%
                          </h2>
                          <p className="text-sm text-white text-opacity-50 pb-[2px] border-t border-white border-opacity-20 leading-[19px]">
                            <span className="text-xs">of</span> 75%
                          </p>
                        </div>
                        <div className="bg-[#150238] rounded-[5px] shadow-innerShadow">
                          <h2 className="text-sm leading-[30px] text-white text-opacity-50">
                            LP
                          </h2>
                        </div>
                      </div>
                      <div>
                        <div className="bg-[#150238] shadow-innerShadow rounded-[5px] mb-[7px]">
                          <h2 className="text-lg font-semibold xl:text-xl text-gradient-5 leading-[30px] xl:leading-[30px]">
                            25%
                          </h2>
                          <p className="text-sm text-white text-opacity-50 pb-[2px] border-t border-white border-opacity-20 leading-[19px]">
                            <span className="text-xs">of</span> 25%
                          </p>
                        </div>
                        <div className="bg-[#150238] rounded-[5px] shadow-innerShadow">
                          <h2 className="text-sm leading-[30px] text-white text-opacity-50">
                            STOCK
                          </h2>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div> */}
              <div className="w-[calc(50%-10px)]">
                <div className="dashboard-card w-full max-w-full group">
                  <div className="__border border-white border-opacity-50" />
                  <div className="relative z-10">
                    <div className="-mb-2">
                      <h6 className="text-xs sm:text-sm font-semibold -translate-y-1/2 mx-4 m-0 text-opacity-50 text-white inline-flex items-center gap-1 bg-[#1C0050] px-3">
                        <span className="group-hover:text-gradient-3 text-gradient-3">
                          PCAP Earned
                        </span>
                      </h6>
                    </div>
                    <div className="bg-gradient9 rounded-[5px] p-[1px]">
                      <div className="bg-[#150238] shadow-innerShadow rounded-[5px]">
                        <h2 className="text-lg font-semibold pt-[14px] pb-[12px]">
                          {pendingPine}
                        </h2>
                        <p className="text-sm text-white text-opacity-50 py-[8px] leading-[19px] border-t border-white border-opacity-20">
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
            ) : !stockApproved ? (
              <button
                type="button"
                className="btn-3 w-full text-md sm:text-lg h-[58px] rounded-b-[10px] rounded-t-none"
                onClick={() => approveStock()}
              >
                Approve STOCK
              </button>
            ) : (
              <div className="flex">
                {!approved ? (
                  <button
                    type="button"
                    className="btn-3 w-full text-md sm:text-lg h-[58px] rounded-bl-[10px] rounded-t-none"
                    onClick={() => approve()}
                  >
                    Approve LP
                  </button>
                ) : !stockApproved ? (
                  <button
                    type="button"
                    className="btn-3 w-full text-md sm:text-lg h-[58px] rounded-bl-[10px] rounded-t-none"
                    onClick={() => approveStock()}
                  >
                    Approve STOCK
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
                  onClick={() => harvest()}
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
              <div className="py-6 md:py-7 h-full relative z-[11]">
                <h5 className="text-md sm:text-lg font-semibold flex items-center flex-grow mb-8 px-4 xl:pl-[30px] pr-0">
                  <span style={{ marginRight: "10px" }}>UNSTAKE</span>
                  <span className="w-0 flex-grow bg-gradient8 h-[1px]"></span>
                </h5>
                <div className="px-4 xl:px-[30px] gap-5 md:gap-[27px] md:gap-y-[17px]">
                  <div className="text-sm font-normal mb-4 xl:text-right xl:pr-6 text-white text-opacity-50">
                    Unstake 75%{" "}
                    <span className="font-bold">{farm.lpSymbol}</span> LP tokens
                    and 25% <span className="font-bold">STOCK</span> tokens
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
                            onChange={(e) => {
                              setUnstakeInput(e.target.value);
                              setUnstakeInputStock(e.target.value * stockPerLP);
                            }}
                          />
                          <div className="text-white text-opacity-50 text-sm font-medium text-left">
                            ${toLocaleString(unstakeInput * lpPrice)}
                          </div>
                        </div>
                        <div className="text-md sm:text-lg font-semibold pr-5">
                          {farm.lpSymbol} LP
                        </div>
                      </div>
                      <div className="text-sm text-white text-opacity-30 border-t border-white border-opacity-20 py-1 mx-[14px] flex justify-between font-medium">
                        <span>{farm.lpSymbol} Available:</span>
                        <span>
                          {toLocaleString(stakedLpBalance, 2, 6, 0.01)}
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
                        setActiveDayStock("");
                        setActiveDay("25%");
                        setUnstakeInput(stakedLpBalance / 4);
                        setUnstakeInputStock(
                          (stakedLpBalance / 4) * stockPerLP
                        );
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
                        setActiveDayStock("");
                        setActiveDay("50%");
                        setUnstakeInput(stakedLpBalance / 2);
                        setUnstakeInputStock(
                          (stakedLpBalance / 2) * stockPerLP
                        );
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
                        setActiveDayStock("");
                        setActiveDay("75%");
                        setUnstakeInput((stakedLpBalance / 4) * 3);
                        setUnstakeInputStock(
                          (stakedLpBalance / 4) * 3 * stockPerLP
                        );
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
                        setActiveDayStock("");
                        setActiveDay("MAX");
                        setUnstakeInput(stakedLpBalance);
                        setUnstakeInputStock(stakedLpBalance * stockPerLP);
                      }}
                      type="button"
                    >
                      MAX
                    </button>
                  </div>
                  <div className="asset-card">
                    <div className="rounded-[10px] bg-[#140236] text-center h-full">
                      <div className="flex justify-between items-center">
                        <div className="pt-4 pb-2 px-[14px] w-0 flex-grow">
                          <input
                            type="number"
                            className="w-full text-md sm:text-lg font-semibold bg-transparent border-0 outline-none text-left text-white placeholder:text-white"
                            placeholder="0.0"
                            value={unstakeInputStock}
                            onChange={(e) => {
                              setUnstakeInputStock(e.target.value);
                              setUnstakeInput(
                                new BigNumber(e.target.value).div(stockPerLP)
                              );
                            }}
                          />
                          <div className="text-white text-opacity-50 text-sm font-medium text-left">
                            ${toLocaleString(unstakeInputStock * stockPrice)}
                          </div>
                        </div>
                        <div className="text-md sm:text-lg font-semibold pr-5">
                          STOCK
                        </div>
                      </div>
                      <div className="text-sm text-white text-opacity-30 border-t border-white border-opacity-20 py-1 mx-[14px] flex justify-between font-medium">
                        <span>STOCK Available:</span>
                        <span>{toLocaleString(stakedStockBalance, 2, 2)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="my-[15px] flex justify-center flex-wrap gap-1 items-center">
                    <button
                      className={`day-btn font-semibold ${
                        activeDayStock === "25%"
                          ? "bg-whiteGradient text-[#150238]"
                          : ""
                      }`}
                      onClick={() => {
                        setActiveDay("");
                        setActiveDayStock("25%");
                        setUnstakeInputStock(stakedStockBalance / 4);
                        setUnstakeInput(stakedStockBalance / 4 / stockPerLP);
                      }}
                      type="button"
                    >
                      25%
                    </button>
                    <button
                      className={`day-btn font-semibold ${
                        activeDayStock === "50%"
                          ? "bg-whiteGradient text-[#150238]"
                          : ""
                      }`}
                      onClick={() => {
                        setActiveDay("");
                        setActiveDayStock("50%");
                        setUnstakeInputStock(stakedStockBalance / 2);
                        setUnstakeInput(stakedStockBalance / 2 / stockPerLP);
                      }}
                      type="button"
                    >
                      50%
                    </button>
                    <button
                      className={`day-btn font-semibold ${
                        activeDayStock === "75%"
                          ? "bg-whiteGradient text-[#150238]"
                          : ""
                      }`}
                      onClick={() => {
                        setActiveDay("");
                        setActiveDayStock("75%");
                        setUnstakeInputStock((stakedStockBalance / 4) * 3);
                        setUnstakeInput(
                          ((stakedStockBalance / 4) * 3) / stockPerLP
                        );
                      }}
                      type="button"
                    >
                      75%
                    </button>
                    <button
                      className={`day-btn font-semibold ${
                        activeDayStock === "MAX"
                          ? "bg-whiteGradient text-[#150238]"
                          : ""
                      }`}
                      onClick={() => {
                        setActiveDay("");
                        setActiveDayStock("MAX");
                        setUnstakeInputStock(stakedStockBalance);
                        setUnstakeInput(stakedStockBalance / stockPerLP);
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
                        setStaked(true);
                        setUnStakeModalOpen(false);
                        unstakeLp();
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
      {/* Stake Modal */}
      <CustomModal
        open={stakeModalOpen}
        setOpen={setStakeModalOpen}
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
              <div className="py-6 md:py-7 h-full relative z-[11]">
                <h5 className="text-md sm:text-lg font-semibold flex items-center flex-grow mb-8 px-4 xl:pl-[30px] pr-0">
                  <div className="flex rounded-md bg-[#150238]"></div>
                  <span style={{ marginRight: "10px" }}>STAKE </span>
                  <span className="w-0 flex-grow bg-gradient8 h-[1px]"></span>
                </h5>

                <div className="px-4 xl:px-[30px] gap-5 md:gap-[27px] md:gap-y-[17px]">
                  <div className="text-sm font-normal mb-4 xl:text-right xl:pr-6 text-white text-opacity-50">
                    Stake 75% <span className="font-bold">{farm.lpSymbol}</span>{" "}
                    LP tokens and 25% <span className="font-bold">STOCK</span>{" "}
                    tokens
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
                            onChange={(e) => {
                              setStakeInput(e.target.value);
                              setStockInput(e.target.value * stockPerLP);
                            }}
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
                        <span>{toLocaleString(lpBalance, 2, 6, 0.01)}</span>
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
                        setActiveDayStock("");
                        setActiveDay("25%");
                        setStakeInput(lpBalance / 4);
                        setStockInput((lpBalance / 4) * stockPerLP);
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
                        setActiveDayStock("");
                        setActiveDay("50%");
                        setStakeInput(lpBalance / 2);
                        setStockInput((lpBalance / 2) * stockPerLP);
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
                        setActiveDayStock("");
                        setActiveDay("75%");
                        setStakeInput((lpBalance / 4) * 3);
                        setStockInput((lpBalance / 4) * 3 * stockPerLP);
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
                        setActiveDayStock("");
                        setActiveDay("MAX");
                        setStakeInput(lpBalance);
                        setStockInput(lpBalance * stockPerLP);
                      }}
                      type="button"
                    >
                      MAX
                    </button>
                  </div>
                  <div className="asset-card">
                    <div className="rounded-[10px] bg-[#140236] text-center h-full">
                      <div className="flex justify-between items-center">
                        <div className="pt-4 pb-2 px-[14px] w-0 flex-grow">
                          <input
                            type="number"
                            className="w-full text-md sm:text-lg font-semibold bg-transparent border-0 outline-none text-left text-white placeholder:text-white"
                            placeholder="0.0"
                            value={stockInput}
                            onChange={(e) => {
                              setStockInput(e.target.value);
                              setStakeInput(
                                new BigNumber(e.target.value).div(stockPerLP)
                              );
                            }}
                          />
                          <div className="text-white text-opacity-50 text-sm font-medium text-left">
                            ${toLocaleString(stockInput * stockPrice)}
                          </div>
                        </div>
                        <div className="text-md sm:text-lg font-semibold pr-5">
                          STOCK
                        </div>
                      </div>
                      <div className="text-sm text-white text-opacity-30 border-t border-white border-opacity-20 py-1 mx-[14px] flex justify-between font-medium">
                        <span>STOCK Available:</span>
                        <span>{toLocaleString(stockBalance, 2, 2)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="my-[15px] flex justify-center flex-wrap gap-1 items-center">
                    <button
                      className={`day-btn font-semibold ${
                        activeDayStock === "25%"
                          ? "bg-whiteGradient text-[#150238]"
                          : ""
                      }`}
                      onClick={() => {
                        setActiveDay("");
                        setActiveDayStock("25%");
                        setStockInput(stockBalance / 4);
                        setStakeInput(stockBalance / 4 / stockPerLP);
                      }}
                      type="button"
                    >
                      25%
                    </button>
                    <button
                      className={`day-btn font-semibold ${
                        activeDayStock === "50%"
                          ? "bg-whiteGradient text-[#150238]"
                          : ""
                      }`}
                      onClick={() => {
                        setActiveDay("");
                        setActiveDayStock("50%");
                        setStockInput(stockBalance / 2);
                        setStakeInput(stockBalance / 2 / stockPerLP);
                      }}
                      type="button"
                    >
                      50%
                    </button>
                    <button
                      className={`day-btn font-semibold ${
                        activeDayStock === "75%"
                          ? "bg-whiteGradient text-[#150238]"
                          : ""
                      }`}
                      onClick={() => {
                        setActiveDay("");
                        setActiveDayStock("75%");
                        setStockInput((stockBalance / 4) * 3);
                        setStakeInput(((stockBalance / 4) * 3) / stockPerLP);
                      }}
                      type="button"
                    >
                      75%
                    </button>
                    <button
                      className={`day-btn font-semibold ${
                        activeDayStock === "MAX"
                          ? "bg-whiteGradient text-[#150238]"
                          : ""
                      }`}
                      onClick={() => {
                        setActiveDay("");
                        setActiveDayStock("MAX");
                        setStockInput(stockBalance);
                        setStakeInput(stockBalance / stockPerLP);
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
                      onClick={() => setStakeModalOpen(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="btn-3 h-[45px] sm:font-bold mt-[15px] px-4 sm:w-full max-w-[142px] bg-menuHover"
                      onClick={() => {
                        setStaked(true);
                        setStakeModalOpen(false);
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
                      calculatorAmountInput === "100"
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
                      calculatorAmountInput === "1000"
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
                    <span className="text-gradient-5">APY: {apr}%</span>
                    <span className="text-gradient-5">
                      Daily APR: {farmROI}%
                    </span>
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
      {/* Lp Details Modal */}
      <CustomModal
        open={stakeInfoModalOpen}
        setOpen={setStakeInfoModalOpen}
        onlyChildren={true}
      >
        <div className="relative z-10 m-auto max-w-[350px] bg-gradient9 rounded-[10px] p-[1px] overflow-hidden fadeInUp">
          <div className="bg-[#33026D] rounded-[10px]">
            <div className="bg-lpDetailsGradient absolute -bottom-full left-0 w-full h-full blur-[75px]" />
            <div className="relative z-10">
              <div className="flex justify-between items-start py-4 px-6 rounded-t-[10px]  bg-[#150238]">
                <div className="text-lg">
                  <span>Stake Ratio</span>
                </div>
                <button
                  type="button"
                  onClick={() => setStakeInfoModalOpen(false)}
                >
                  <ClearIcon />
                </button>
              </div>
              <div className="py-5 px-5">
                <div className="bg-[#150238] rounded-[10px] px-4 py-3 text-sm">
                  Harness the power of the Heart Fund to supercharge your yield
                  potential, leveraging LP and STOCK token staking to unlock
                  premium rewards and maximise your profits in the ever-evolving
                  world of DeFi. leveraging LP and STOCK token staking to unlock
                  premium rewards and maximise your profits in the ever-evolving
                  world of DeFi.
                </div>
              </div>
            </div>
          </div>
        </div>
      </CustomModal>
    </>
  );
};
export default HeartFundCard;
