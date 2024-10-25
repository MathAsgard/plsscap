import { Switch } from "@material-tailwind/react";
import React, { useState, useEffect } from "react";
import CustomSelectTwo from "../../../components/CustomSelectTwo";
import CapitalFarmsCard from "./CapitalFarmsCard";
import farms from "../../../config/constants/farms.js";

let farmsArray = JSON.parse(JSON.stringify(farms));
let farmsFilters = {};

const CapitalFarmSection = () => {
  const [view, setView] = React.useState("list");
  const [value, setValue] = React.useState("");

  const [active, setActive] = useState(true);
  const [stackedOnly, setStacked] = useState(false);
  const [search, setSearch] = useState("");
  const [dropdown, setDropdown] = useState("");

  function dropDownFilter(value) {
    const _val = value.toLowerCase();
    switch (_val) {
      case "":
        farmsArray = JSON.parse(JSON.stringify(farms));
        break;
      case "hot":
        farmsArray = JSON.parse(JSON.stringify(farms));
        farmsArray.reverse();
        break;
      case "apr":
        farmsArray = JSON.parse(JSON.stringify(farms));
        farmsArray.sort(function (a, b) {
          return (
            parseFloat(farmsFilters[b.lpAddress].farmAPR) -
            parseFloat(farmsFilters[a.lpAddress].farmAPR)
          );
        });
        break;
      case "earned":
        farmsArray = JSON.parse(JSON.stringify(farms));
        farmsArray.sort(function (a, b) {
          return (
            parseFloat(farmsFilters[b.lpAddress].pendingPine) -
            parseFloat(farmsFilters[a.lpAddress].pendingPine)
          );
        });
        break;
      case "liquidity":
        farmsArray = JSON.parse(JSON.stringify(farms));
        farmsArray.sort(function (a, b) {
          return (
            parseFloat(farmsFilters[b.lpAddress].totalLiquidity) -
            parseFloat(farmsFilters[a.lpAddress].totalLiquidity)
          );
        });
        break;
    }
    setDropdown(value);
  }

  function objectToFilter(lpAddress, object) {
    farmsFilters[lpAddress] = object;
  }

  return (
    <section className="pt-12 xl:pt-24 relative z-[999]">
      <div className="container xl:max-w-[1306px]">
        <div className="flex flex-wrap justify-center gap-5 items-center mb-8 md:mb-[46px]">
          <div className="w-full sm:max-w-[292px] bg-gradient9 p-[1px] rounded-[5px]">
            <input
              type="text"
              className="w-full h-10 border-0 outline-0 bg-[#10032F] font-semibold text-white placeholder:text-white placeholder:text-opacity-50 px-[18px] rounded-[5px]"
              placeholder="Search farms"
              onChange={(e) => setSearch(e.target.value)}
              value={search}
            />
          </div>
          <div className="w-full sm:max-w-[180px]">
            <CustomSelectTwo
              label="Sort By"
              options={[
                {
                  value: "Hot",
                  label: "Hot",
                },
                {
                  value: "APR",
                  label: "APR",
                },
                {
                  value: "Earned",
                  label: "Earned",
                },
                {
                  value: "Liquidity",
                  label: "Liquidity",
                },
                {
                  value: "Multiplier",
                  label: "Multiplier",
                },
              ]}
              value={dropdown}
              setValue={setDropdown}
              dropDownFilter={dropDownFilter}
            />
          </div>
          <div className="bg-gradient9 rounded-full p-[1px]">
            <div
              className={`flex flex-wrap gap-x-2 sm:gap-x-0 gap-y-2 items-center ${
                view === "grid"
                  ? "bg-[#2C086E] shadow-innerShadow"
                  : "bg-[#1C0050]"
              }  rounded-full relative z-10`}
            >
              <button
                type="button"
                className={`view-btn h-10 ${view === "list" ? "active" : ""}`}
                onClick={() => {
                  setView("list");
                  setActive(true);
                }}
              >
                <span>Active</span>
              </button>
              <button
                type="button"
                className={`view-btn h-10 ${view === "grid" ? "active2" : ""}`}
                onClick={() => {
                  setView("grid");
                  setActive(false);
                }}
              >
                <span>Inactive</span>
              </button>
            </div>
          </div>
          {/* <CustomSwitch
						value={staked}
						setValue={setStaked}
						label="Staked"
						size="md"
					/>
					<div className="bg-gradient9 rounded-full p-[1px]">
						<div className="flex flex-wrap gap-x-3 sm:gap-x-7 gap-y-2 items-center bg-[#10032F] rounded-full relative z-10  px-[11px] py-2 sm:text-md font-medium">
							<CustomSwitch
								value={native}
								setValue={setNative}
								label="Native"
							/>
							<CustomSwitch
								value={pulseX}
								setValue={setPulseX}
								label="PulseX"
							/>
						</div>
					</div> */}

          <div className="custom--switch">
            <Switch
              ripple={false}
              className="h-full w-full  bg-transparent checked:bg-transparent"
              containerProps={{
                className: "w-14 h-8 select--container",
              }}
              circleProps={{
                className:
                  "before:hidden left-0.5 border-none before:bg-gradient9 w-6 h-6 translate-x-[3px]",
              }}
              label="Staked"
              onChange={(e) => setStacked(!stackedOnly)}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 xl:gap-10">
          {farmsArray.map((farm, index) => (
            <CapitalFarmsCard
              key={index}
              objectToFilter={objectToFilter}
              active={active}
              search={search}
              stakedOnly={stackedOnly}
              dropdown={dropdown}
              {...farm}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
export default CapitalFarmSection;
