import React from "react";

const DashboardCards = ({ data }) => {
  return (
    <section className="py-[50px]">
      <div className="container xl:max-w-[1267px]">
        <div className="flex flex-wrap gap-4 justify-around">
          {data.map((item, index) => (
            <div className="dashboard-card" key={index}>
              <img
                src="/img/dashboard-card-bg.png"
                className="absolute left-0 w-full"
                alt=""
              />
              <h6 className="text-xs sm:text-normal font-semibold -translate-y-1/2 mx-4 m-0 -mb-2">
                {item.title}
              </h6>
              <div className="bg-tableBg shadow-innerShadow rounded-[5px]">
                <h2 className="text-lg md:text-xl font-semibold text-gradient-3 pt-[8px] pb-[5px]">
                  {item.amount}
                </h2>
                <p className="text-white text-opacity-50 pt-[6px] pb-[2px] border-t border-white border-opacity-30">
                  {item.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default DashboardCards;
