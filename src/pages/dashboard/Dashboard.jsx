import React, { useState, useEffect } from "react";
import Faqs from "../../components/Faqs";
import Layout from "../../components/Layout";
import PageHeader from "../../components/PageHeader";
import AssetsAndWallets from "./components/AssetsAndWallets";
import DashboardCards from "./components/DashboardCards";
import Transactions from "./components/Transactions";

import farms from "../../config/constants/farms.js";
import rhFarms from "../../config/constants/farmsRh.js";
import lpABI from "../../config/abi/lpToken.json";

import BigNumber from "bignumber.js/bignumber";
import useInterval from "../../hooks/useInterval";
import contracts from "../../config/constants/contracts.js";
import {
  multicall,
  writeContract,
  fetchBalance,
  waitForTransaction,
} from "@wagmi/core";
import { useAccount } from "wagmi";

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

function milStr(num) {
  if (num > 1000000000) return toLocaleString(num / 1000000000, 2, 2) + "Bi";
  else if (num > 1000000) return toLocaleString(num / 1000000, 2, 2) + "Mi";
  else if (num > 1000) return toLocaleString(num / 1000, 2, 2) + "K";
  else return toLocaleString(num, 2, 2);
}

BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 18,
});
let farmsData = [];

const Dashboard = () => {
  const [stockPrice, setStockPrice] = React.useState(0);
  const [stockTVL, setStockTVL] = React.useState(0);
  const [stockPoolTVL, setStockPoolTVL] = React.useState(0);
  const [farmsTVL, setFarmsTVL] = React.useState(0);
  const [rhFarmsTVL, setRhFarmsTVL] = React.useState(0);
  const [plsBalance, setPlsBalance] = React.useState(0);
  const [pcapBalance, setPcapBalance] = React.useState(0);
  const [stockBalance, setStockBalance] = React.useState(0);
  const [pslPrice, setPlsPrice] = React.useState(0);
  const [pcapPrice, setPcapPrice] = React.useState(0);
  const [stockStaked, setStockStaked] = React.useState(0);
  const [stockDividends, setStockDividends] = React.useState(0);
  const [userLocks, setUserLocks] = React.useState(0);

  const userAccount = useAccount({
    onConnect() {
      getStats();
    },
    onDisconnect() {
      getStats();
    },
  });

  async function getAllLpData() {
    const hash = [];
    const allLPs = [];
    farms.forEach((e) => {
      if (!hash[e.lpAddress]) {
        hash[e.lpAddress] = true;
        allLPs.push(e.lpAddress);
      }
    });
    rhFarms.forEach((e) => {
      if (!hash[e.lpAddress]) {
        hash[e.lpAddress] = true;
        allLPs.push(e.lpAddress);
      }
    });

    const request = await fetch(
      `https://api.dexscreener.com/latest/dex/pairs/pulsechain/${allLPs.join(
        ","
      )}`
    );
    const response = await request.json();

    const supplyCall = allLPs.map((e) => {
      return {
        address: e,
        abi: lpABI,
        functionName: "totalSupply",
        args: [],
      };
    });

    const balanceCallFarms = allLPs.map((e) => {
      return {
        address: e,
        abi: lpABI,
        functionName: "balanceOf",
        args: [contracts.masterChef.address],
      };
    });

    const balanceCallRhFarms = allLPs.map((e) => {
      return {
        address: e,
        abi: lpABI,
        functionName: "balanceOf",
        args: [contracts.masterChefRh.address],
      };
    });

    const ryphBalanceCallFarms = farms
      .filter((farm) => farm.plsxPid !== null)
      .map((farm) => {
        return {
          ...contracts.masterchefPLSX,
          functionName: "userInfo",
          args: [farm.plsxPid, contracts.masterChef.address],
        };
      });

    const ryphBalanceCallRhFarms = rhFarms.map((farm) => {
      return {
        ...contracts.masterchefPLSX,
        functionName: "userInfo",
        args: [farm.plsxPid, contracts.masterChefRh.address],
      };
    });
    const [
      supply,
      balanceFarms,
      balanceRhFarms,
      ryphBalanceFarms,
      ryphBalanceRhFarms,
    ] = await Promise.all([
      multicall({ contracts: supplyCall }),
      multicall({ contracts: balanceCallFarms }),
      multicall({ contracts: balanceCallRhFarms }),
      multicall({ contracts: ryphBalanceCallFarms }),
      multicall({ contracts: ryphBalanceCallRhFarms }),
    ]);

    allLPs.forEach((lpAddress, index) => {
      hash["allLPs"] = allLPs;
      hash[lpAddress] = [];
      hash[lpAddress]["liquidity"] = response.pairs?.filter(
        (pair) => pair?.pairAddress === lpAddress
      )[0]?.liquidity.usd;
      hash[lpAddress]["supply"] = Number(supply[index].result) / 1e18;
      hash[lpAddress]["price"] =
        hash[lpAddress]["liquidity"] / hash[lpAddress]["supply"];
      hash[lpAddress]["balanceFarms"] =
        Number(balanceFarms[index].result) / 1e18;
      hash[lpAddress]["balanceRhFarms"] =
        Number(balanceRhFarms[index].result) / 1e18;
      hash[lpAddress]["balanceFarmsUSD"] =
        (Number(balanceFarms[index].result) / 1e18) * hash[lpAddress]["price"];
      hash[lpAddress]["balanceRhFarmsUSD"] =
        (Number(balanceRhFarms[index].result) / 1e18) *
        hash[lpAddress]["price"];
    });

    farms
      .filter((farm) => farm.plsxPid !== null)
      .forEach((farm, index) => {
        hash[farm.lpAddress]["balanceFarms"] +=
          Number(ryphBalanceFarms[index].result[0]) / 1e18;
        hash[farm.lpAddress]["balanceFarmsUSD"] +=
          (Number(ryphBalanceFarms[index].result[0]) / 1e18) *
          hash[farm.lpAddress]["price"];
      });

    rhFarms.forEach((farm, index) => {
      hash[farm.lpAddress]["balanceRhFarms"] +=
        Number(ryphBalanceRhFarms[index].result[0]) / 1e18;
      hash[farm.lpAddress]["balanceRhFarmsUSD"] +=
        (Number(ryphBalanceRhFarms[index].result[0]) / 1e18) *
        hash[farm.lpAddress]["price"];
    });

    return hash;
  }
  async function getFarmsData(lpData) {
    const stakedCall = farms.map((farm) => {
      return {
        ...contracts.masterChef,
        functionName: "userInfo",
        args: [farm.pid, userAccount.address],
      };
    });
    const rewardsCall = farms.map((farm) => {
      return {
        ...contracts.masterChef,
        functionName: "pendingPcap",
        args: [farm.pid, userAccount.address],
      };
    });
    const stakedRhCall = farms.map((farm) => {
      return {
        ...contracts.masterChefRh,
        functionName: "userInfo",
        args: [farm.pid, userAccount.address],
      };
    });
    const rewardsRhCall = farms.map((farm) => {
      return {
        ...contracts.masterChefRh,
        functionName: "pendingPcap",
        args: [farm.pid, userAccount.address],
      };
    });
    const stockRewardsRhCall = farms.map((farm) => {
      return {
        ...contracts.masterChefRh,
        functionName: "pendingStock",
        args: [farm.pid, userAccount.address],
      };
    });
    const [stakedFarms, rewardsFarms, stakedRh, rewardsRh, stockRewardsRh] =
      await Promise.all([
        multicall({ contracts: stakedCall }),
        multicall({ contracts: rewardsCall }),
        multicall({ contracts: stakedRhCall }),
        multicall({ contracts: rewardsRhCall }),
        multicall({ contracts: stockRewardsRhCall }),
      ]);
    const _farmsData = [];
    _farmsData["farms"] = [];
    _farmsData["rhFarms"] = [];

    farms.forEach((farm, index) => {
      if (index === 0) {
        _farmsData["farms"]["staked"] =
          Number(stakedFarms[index].result[0]) / 1e18;
        _farmsData["farms"]["stakedUSD"] =
          (Number(stakedFarms[index].result[0]) / 1e18) *
          lpData[farm.lpAddress]["price"];
        _farmsData["farms"]["rewards"] =
          Number(rewardsFarms[index].result) / 1e18;
        _farmsData["farms"]["rewardsUSD"] =
          (Number(rewardsFarms[index].result) / 1e18) * pcapPrice;
      } else {
        _farmsData["farms"]["staked"] +=
          Number(stakedFarms[index].result[0]) / 1e18;
        _farmsData["farms"]["stakedUSD"] +=
          (Number(stakedFarms[index].result[0]) / 1e18) *
          lpData[farm.lpAddress]["price"];
        _farmsData["farms"]["rewards"] +=
          Number(rewardsFarms[index].result) / 1e18;
        _farmsData["farms"]["rewardsUSD"] +=
          (Number(rewardsFarms[index].result) / 1e18) * pcapPrice;
      }
    });
    rhFarms.forEach((farm, index) => {
      if (index === 0) {
        _farmsData["rhFarms"]["staked"] =
          Number(stakedRh[index].result[0]) / 1e18;
        _farmsData["rhFarms"]["stakedStock"] =
          Number(stakedRh[index].result[1]) / 1e18;
        _farmsData["rhFarms"]["stakedUSD"] =
          (Number(stakedRh[index].result[0]) / 1e18) *
          lpData[farm.lpAddress]["price"];
        _farmsData["rhFarms"]["stakedUSD"] +=
          (Number(stakedRh[index].result[1]) / 1e18) * stockPrice;
        _farmsData["rhFarms"]["rewards"] =
          Number(rewardsRh[index].result) / 1e18;
        _farmsData["rhFarms"]["rewardsStock"] =
          Number(stockRewardsRh[index].result) / 1e18;
        _farmsData["rhFarms"]["rewardsUSD"] =
          (Number(rewardsRh[index].result) / 1e18) * pcapPrice;
        _farmsData["rhFarms"]["rewardsUSD"] +=
          (Number(stockRewardsRh[index].result) / 1e18) * stockPrice;
      } else {
        _farmsData["rhFarms"]["staked"] +=
          Number(stakedRh[index].result[0]) / 1e18;
        _farmsData["rhFarms"]["stakedStock"] +=
          Number(stakedRh[index].result[1]) / 1e18;
        _farmsData["rhFarms"]["stakedUSD"] +=
          (Number(stakedRh[index].result[0]) / 1e18) *
          lpData[farm.lpAddress]["price"];
        _farmsData["rhFarms"]["stakedUSD"] +=
          (Number(stakedRh[index].result[1]) / 1e18) * stockPrice;
        _farmsData["rhFarms"]["rewards"] +=
          Number(rewardsRh[index].result) / 1e18;
        _farmsData["rhFarms"]["rewardsStock"] +=
          Number(stockRewardsRh[index].result) / 1e18;
        _farmsData["rhFarms"]["rewardsUSD"] +=
          (Number(rewardsRh[index].result) / 1e18) * pcapPrice;
        _farmsData["rhFarms"]["rewardsUSD"] +=
          (Number(stockRewardsRh[index].result) / 1e18) * stockPrice;
      }
    });
    return _farmsData;
  }

  async function getPlsPrice() {
    const response = await fetch(
      `https://api.dexscreener.com/latest/dex/pairs/pulsechain/0xe56043671df55de5cdf8459710433c10324de0ae`
    );
    const rsps = await response.json();
    return rsps.pairs[0].priceUsd;
  }

  async function getStats() {
    const lpData = await getAllLpData();
    const _plsBalance = await fetchBalance({
      address: userAccount.address,
    });
    const response = await fetch(
      `https://api.dexscreener.com/latest/dex/pairs/pulsechain/0x554dcc3dFD807ef343855837A404bF4dF6D8C7Ee`
    );
    const rsps = await response.json();
    const _plsPrice = await getPlsPrice();
    const pinePrice = rsps.pairs?.filter(
      (pair) =>
        pair.pairAddress === "0x554dcc3dFD807ef343855837A404bF4dF6D8C7Ee"
    )[0].priceUsd;
    const [
      _stockSupply,
      _stockInPool,
      _daiPlsSupply,
      _daiPlsReserves,
      _pcapBalance,
      _stockBalance,
      _rhStockBalance,
      _stockDividends,
      _stockStaked,
      _userLocks,
    ] = await multicall({
      contracts: [
        {
          ...contracts.stockToken,
          functionName: "totalSupply",
          args: [],
        },
        {
          ...contracts.stockPool,
          functionName: "sharesSupply",
          args: [],
        },
        {
          address: "0xe56043671df55de5cdf8459710433c10324de0ae",
          abi: lpABI,
          functionName: "totalSupply",
          args: [],
        },
        {
          address: "0xe56043671df55de5cdf8459710433c10324de0ae",
          abi: lpABI,
          functionName: "getReserves",
          args: [],
        },
        {
          ...contracts.pcapToken,
          functionName: "balanceOf",
          args: [userAccount.address],
        },
        {
          ...contracts.stockToken,
          functionName: "balanceOf",
          args: [userAccount.address],
        },
        {
          ...contracts.stockToken,
          functionName: "balanceOf",
          args: [contracts.masterChefRh.address],
        },
        {
          ...contracts.stockPool,
          functionName: "estimateDividendsOf",
          args: [userAccount.address, false],
        },
        {
          ...contracts.stockPool,
          functionName: "userStats",
          args: [userAccount.address],
        },
        {
          ...contracts.stockToken,
          functionName: "userLocksArray",
          args: [userAccount.address],
        },
      ],
    });

    const initialValue = 0;

    setStockPrice(
      (Number(_daiPlsReserves.result[1]) * 2) / Number(_daiPlsSupply.result)
    );
    setStockTVL(Number((stockPrice * Number(_stockSupply.result)) / 1e18));
    setStockPoolTVL(Number((stockPrice * Number(_stockInPool.result)) / 1e18));
    setFarmsTVL(
      lpData["allLPs"].reduce((accumulator, currentValue) => {
        return accumulator + Number(lpData[currentValue]["balanceFarmsUSD"]);
      }, initialValue)
    );
    setRhFarmsTVL(
      lpData["allLPs"].reduce((accumulator, currentValue) => {
        return accumulator + Number(lpData[currentValue]["balanceRhFarmsUSD"]);
      }, initialValue) +
        (Number(_rhStockBalance.result) / 1e18) * stockPrice
    );
    setPlsBalance(Number(_plsBalance.value) / 1e18);
    setStockBalance(Number(_stockBalance.result) / 1e18);
    setPcapBalance(Number(_pcapBalance.result) / 1e18);
    setPlsPrice(_plsPrice);
    setPcapPrice(pinePrice);

    farmsData = await getFarmsData(lpData);
    setStockStaked(Number(_stockStaked.result[2]) / 1e18);
    setStockDividends(Number(_stockDividends.result) / 1e18);

    setUserLocks(
      _userLocks.result
        .filter((lock) => {
          return lock.claimed == false;
        })
        .reduce((accumulator, currentValue) => {
          return accumulator + Number(currentValue.amount) / 1e18;
        }, initialValue)
    );
  }

  useEffect(() => {
    getStats();
  }, [stockPrice]);

  useInterval(async () => {
    await getStats();
  }, 15000);

  const cardsData = [
    {
      title: "Stock Liquidity",
      amount: "$" + milStr(stockTVL),
      subtitle: "Warren Protocol",
    },
    {
      title: "Capital Farms TVL",
      amount: "$" + milStr(farmsTVL),
      subtitle: "Total Value Locked",
    },
    {
      title: "Heart Fund TVL",
      amount: "$" + milStr(rhFarmsTVL),
      subtitle: "Total Value Locked",
    },
    {
      title: "Stock Pool TVL",
      amount: "$" + milStr(stockPoolTVL),
      subtitle: "Total Value Locked",
    },
    {
      title: "STOCK Market Cap",
      amount: "$" + milStr(stockTVL),
      subtitle: "Total Valuation",
    },
  ];

  return (
    <>
      <Layout>
        <PageHeader
          title="Dashboard"
          subtitle="Manage & Monitor your Portfolio"
          text="Managing your Assets and Portfolio in our dApp has never been easier. Harness the power of data-driven insights to take your investment journey to the next level."
          miniFav="/img/mini-fav.png"
        />
        <DashboardCards data={cardsData} />
        <AssetsAndWallets
          pcapBalance={milStr(pcapBalance)}
          pcapBalanceUSD={milStr(pcapBalance * pcapPrice)}
          stockBalance={milStr(stockBalance)}
          stockBalanceUSD={milStr(stockBalance * stockPrice)}
          plsBalance={milStr(plsBalance)}
          plsBalanceUSD={milStr(plsBalance * pslPrice)}
          farmsData={farmsData}
          stockStaked={stockStaked}
          stockStakedUSD={stockStaked * stockPrice}
          stockDividends={stockDividends}
          stockLockUSD={userLocks * stockPrice}
        />
        <Transactions />
        <Faqs />
      </Layout>
    </>
  );
};
export default Dashboard;
