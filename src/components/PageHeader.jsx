import React from "react";

const PageHeader = ({ title, subtitle, text, miniFav }) => {
  return (
    <section className="pt-6 md:pt-12 lg:pt-[135px]">
      <div className="container xl:max-w-[1300px]">
        <div className="p-[1px] shadow-chipShadow bg-pageHeader relative z-10 rounded-[10px]">
          <div
            className="pt-[40px] pb-[80px] md:py-[98px] md:pr-6 lg:pr-[120px] rounded-[10px] relative"
            style={{
              background: `url('/img/page-header.png') no-repeat center center / cover`,
            }}
          >
            <div className="flex flex-wrap md:flex-nowrap items-center justify-between gap-6">
              <div className="py-4 px-6 md:px-[37px] bg-[#150238] shadow-chipShadow rounded-r-[20px]">
                <h1 className="text-2xl md:text-3xl lg:text-[40px] font-semibold">
                  {title}
                </h1>
                <p className="font-medium text-gradient-3">{subtitle}</p>
              </div>
              <div className="w-full md:w-[200px] flex-grow max-w-[499px] md:text-md lg:text-lg px-6 md:px-0">
                {text}
              </div>
            </div>
            <img
              src={miniFav}
              alt=""
              className="absolute right-4 bottom-4     md:right-[41px] md:bottom-[34px]"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default PageHeader;
