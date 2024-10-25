import React from "react";
import CountdownCard from "../../../components/CountdownCard";

function toLocaleString(num, min, max) {
  const _number = isNaN(Number(num)) ? 0 : Number(num);
  return _number.toLocaleString(undefined, {
    minimumFractionDigits: min,
    maximumFractionDigits: max,
  });
}

const StockVaultCard = ({ item, stockPrice, unstake }) => {
  /* 	const [mobile, setMobile] = React.useState(false); */
  const handleMobile = () => {
    if (window.innerWidth < 768) {
      /* 	setMobile(true); */
    }
  };
  React.useEffect(() => {
    handleMobile();
    window.addEventListener("resize", handleMobile);
    return () => window.removeEventListener("resize", handleMobile);
  }, []);
  return (
    <>
      <div className="asset-card h-full">
        <div className="inner">
          <div
            className="py-4 px-4 sm:px-5 h-full"
            style={{
              background: `url('/img/asset-card-shape.png') no-repeat top right / cover`,
              paddingTop: "25px",
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
                    <h6 className="text-xs sm:text-normal font-semibold -translate-y-1/2 mx-4 m-0 -mb-2 text-opacity-50 text-white">
                      My Stock
                    </h6>
                    <div className="bg-tableBg shadow-innerShadow rounded-[5px]">
                      <h2 className="text-lg md:text-[22px] font-semibold pt-3 pb-2">
                        <div className="font-semibold">
                          {toLocaleString(Number(item.amount) / 1e18, 2, 2)}{" "}
                          <span className="text-gradient-3">STOCK</span>
                        </div>
                      </h2>
                      <p className="text-sm text-white text-opacity-50 pb-[2px] border-t border-white border-opacity-20">
                        $
                        {toLocaleString(
                          (Number(item.amount) / 1e18) * stockPrice,
                          2,
                          2
                        )}
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
                    <h6 className="text-xs sm:text-normal font-semibold -translate-y-1/2 mx-4 m-0 -mb-2 text-opacity-50 text-white">
                      My Shares
                    </h6>
                    <div className="bg-tableBg shadow-innerShadow rounded-[5px]">
                      <h2 className="text-lg md:text-[22px] font-semibold pt-3 pb-2">
                        {toLocaleString(Number(item.shares) / 1e18, 2, 2)}
                      </h2>
                      <p className="text-sm text-white text-opacity-50 pb-[2px] border-t border-white border-opacity-20">
                        +{(Number(item.duration) / 86400) * 3}% Bonus
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
                    <h6 className="text-xs sm:text-normal font-semibold -translate-y-1/2 mx-4 m-0 -mb-2 text-opacity-50 text-white">
                      Stake Duration
                    </h6>
                    <div className="bg-tableBg shadow-innerShadow rounded-[5px]">
                      <h2 className="text-lg text-blue font-semibold pt-3 pb-2">
                        {
                          (Number(item.duration) / 86400)
                            .toString()
                            .split(".")[0]
                        }{" "}
                        DAYS
                      </h2>
                      <p className="text-sm pb-[2px] border-t border-white border-opacity-20">
                        <span className="text-sm text-gradient-3 min:w-[155px]">
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
                    <h6 className="text-xs sm:text-normal font-semibold -translate-y-1/2 mx-4 m-0 -mb-2 text-opacity-50 text-white">
                      Days Left
                    </h6>
                    <div className="bg-tableBg shadow-innerShadow rounded-[5px]">
                      <h2 className="text-lg font-semibold pt-3 pb-2">
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
                      </h2>
                      <p className="text-sm text-white text-opacity-50 pb-[2px] border-t border-white border-opacity-20">
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
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full">
                <button
                  type="button"
                  className="stake-btn w-full h-[44px] text-[#808898]"
                  onClick={() => unstake(item.stakeId)}
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

export default StockVaultCard;
