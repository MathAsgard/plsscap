import React from "react";
import { Link } from "react-router-dom";

const CustomToast = ({ toast, t, type, title, description, hash }) => {
  if (type === "failed") {
    return (
      <div className="min-w-[320px] max-w-[320px] flex items-stretch justify-center h-fit">
        <div
          className="w-[50px] px-13 flex items-center justify-center rounded-l-[16px]"
          style={{
            background:
              "linear-gradient(235.48deg, #D8308D -7.21%, #F03DA8 -7.21%, #E17737 121.49%)",
          }}
        >
          <img src={"/img/circle.png"} className="w-6 h-6" />
        </div>
        <div className="w-[270px] flex items-center justify-between px-4 rounded-r-[16px] h-fit py-3 bg-[#070115]">
          <div className="flex flex-col gap-1 justify-center">
            <div className="text-[16px] leading-[19px] font-[600]">
              Transaction Failed!
            </div>
            <div className="text-gray-500 leading-[19px] text-[16px] font-[400]">
              Please try again
            </div>
          </div>
          <img
            onClick={() => toast.dismiss(t.id)}
            src="/img/close.png"
            className="w-6 h-6 cursor-pointer"
          />
        </div>
      </div>
    );
  } else if (type === "pending") {
    return (
      <div className="min-w-[320px] max-w-[320px] flex items-stretch justify-center h-fit">
        <div
          className="w-[50px] px-13 flex items-center justify-center rounded-l-[16px]"
          style={{
            background: "linear-gradient(180deg, #FFFFFF 0%, #999999 100%)",
          }}
        >
          <img src={"/img/circle.png"} className="w-6 h-6" />
        </div>
        <div className="w-[270px] flex items-center justify-between px-4 rounded-r-[16px] h-fit py-3 bg-[#070115]">
          <div className="flex flex-col gap-1 justify-center">
            <div className="text-[16px] leading-[19px] font-[600]">
              {description}
            </div>
          </div>
          <img
            onClick={() => toast.dismiss(t.id)}
            src="/img/close.png"
            className="w-6 h-6 cursor-pointer"
          />
        </div>
      </div>
    );
  } else if (type === "submit") {
    return (
      <div className="min-w-[320px] max-w-[320px] flex items-stretch justify-center h-fit">
        <div
          className="w-[50px] px-13 flex items-center justify-center rounded-l-[16px]"
          style={{
            background: "linear-gradient(180deg, #FFFFFF 0%, #999999 100%)",
          }}
        >
          <img src={"/img/circle.png"} className="w-6 h-6" />
        </div>
        <div className="w-[270px] flex items-center justify-between px-4 rounded-r-[16px] h-fit py-3 bg-[#070115]">
          <div className="flex flex-col gap-1 justify-center">
            <div className="text-[16px] leading-[19px] font-[600]">
              {description}
            </div>
            <Link
              to={`https://otter.pulsechain.com/tx/${hash}`}
              target="_blank"
            >
              <div
                className="text-transparent inline-block bg-clip-text leading-[19px] text-[16px] font-[400]"
                style={{
                  backgroundImage:
                    "linear-gradient(90deg, #9506F9 0%, #B239FA 26%, #DB39F8 49.5%, #EF68DC 75.5%, #F7DBB2 100%)",
                }}
              >
                View on Otterscan
              </div>
            </Link>
          </div>
          <img
            onClick={() => toast.dismiss(t.id)}
            src="/img/close.png"
            className="w-6 h-6 cursor-pointer"
          />
        </div>
      </div>
    );
  } else if (type === "confirmed") {
    return (
      <div className="min-w-[320px] max-w-[320px] flex items-stretch justify-center h-fit">
        <div
          className="w-[50px] px-13 flex items-center justify-center rounded-l-[16px]"
          style={{
            background: "linear-gradient(180deg, #FFFFFF 0%, #999999 100%)",
          }}
        >
          <img src={"/img/circle.png"} className="w-6 h-6" />
        </div>
        <div className="w-[270px] flex items-center justify-between px-4 rounded-r-[16px] h-fit py-5 bg-[#070115]">
          <div className="flex flex-col gap-1 justify-center">
            <div className="text-[20px] leading-[19px] font-[600]">{title}</div>
            {description}
            <Link
              to={`https://otter.pulsechain.com/tx/${hash}`}
              target="_blank"
            >
              <div
                className="text-transparent inline-block bg-clip-text leading-[19px] text-[16px] font-[400]"
                style={{
                  backgroundImage:
                    "linear-gradient(90deg, #9506F9 0%, #B239FA 26%, #DB39F8 49.5%, #EF68DC 75.5%, #F7DBB2 100%)",
                }}
              >
                View on Otterscan
              </div>
            </Link>
          </div>
          <img
            onClick={() => toast.dismiss(t.id)}
            src="/img/close.png"
            className="w-6 h-6 cursor-pointer"
          />
        </div>
      </div>
    );
  }
};

export default CustomToast;
