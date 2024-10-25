import React from "react";
import CountdownCard from "../../../components/CountdownCard";
import { Circle } from "../../../components/Icon";

const StockLock = () => {
  const [view, setView] = React.useState("list");
  /* const [mobile, setMobile] = React.useState(false); */
  const handleMobile = () => {
    if (window.innerWidth < 768) {
      /* setMobile(true); */
      setView("grid");
    } else {
      /* setMobile(false); */
      setView("list");
    }
  };
  React.useEffect(() => {
    handleMobile();
    window.addEventListener("resize", handleMobile);
    return () => window.removeEventListener("resize", handleMobile);
  }, []);
  return (
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
                                placeholder="12,456.33"
                              />
                              <div className="text-white text-opacity-50 text-sm font-bold text-left">
                                $122,948.81
                              </div>
                            </div>
                            <div className="text-md sm:text-lg font-semibold pr-5 flex items-center gap-1 text-gradient-5">
                              <Circle /> STOCK
                            </div>
                          </div>
                          <div className="text-sm text-white text-opacity-50 border-t border-white border-opacity-20 py-1 mx-[14px] flex justify-between font-medium">
                            <span>Wallet Balance</span>
                            <span>9,364,332.77</span>
                          </div>
                        </div>
                      </div>
                      <div className="mb-[19px]" />
                      <button
                        type="button"
                        className="btn-3 w-full h-[45px] font-semibold sm:font-semibold"
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
                              {data
                                .map((item, index) => (
                                  <tr className="text-center" key={index}>
                                    <td className="custom-table-td px-4 py-[15px] bg-[#150238]">
                                      <div className="md:font-semibold text-nowrap">
                                        <span className="text-gradient-4">
                                          10,000,999.44
                                        </span>
                                      </div>
                                    </td>
                                    <td className="custom-table-td px-2 py-[15px] bg-[#150238]">
                                      <div className="md:font-medium text-normal text-opacity-50 text-nowrap">
                                        <CountdownCard
                                          targetDate={`October 30, 2050 00:00:00`}
                                          showDays={true}
                                          shortend={true}
                                        />
                                      </div>
                                    </td>
                                    <td className="custom-table-td px-2 pr-4 py-[15px] bg-[#150238]">
                                      <button
                                        type="button"
                                        className="stake-btn text-sm font-semibold h-8 w-[90px] bg-[#0D0320]"
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
            {data.map((item, index) => (
              <div
                className="w-full lg:w-[calc(50%-10px)] xl:w-[calc(33%-20px)]"
                key={index}
              >
                <LockCard />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

const LockCard = () => {
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
                        17,355.72
                      </h2>
                      <p className="text-sm pb-[2px] border-t border-white border-opacity-20">
                        <span className="text-sm text-gradient-3 min:w-[155px]">
                          $15,374.77
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
                          targetDate={"May 30, 2024 00:00:00"}
                          shortend={true}
                          showDays={true}
                        />
                      </h2>
                      <p className="text-sm text-white text-opacity-50 pb-[2px] border-t border-white border-opacity-20">
                        till Tokens Unlock
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full">
                <button
                  type="button"
                  className="stake-btn w-full h-[40px] text-[#808898]"
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

const data = [{}, {}, {}, {}, {}, {}];
export default StockLock;
