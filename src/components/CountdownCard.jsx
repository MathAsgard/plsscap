import React from "react";

import Countdown from "react-countdown";
const renderer = ({
  days,
  hours,
  minutes,
  seconds,
  completed,
  className,
  shortend,
  showDays,
}) => {
  if (completed) {
    return <span style={{ color: "#DC3545" }}>Stake ended!</span>;
  } else {
    return (
      <div className={`flex items-center justify-center gap-1 ${className}`}>
        {showDays && (
          <div>
            <span>{days < 10 ? `0${days}` : days}</span>
            <span>{shortend ? "d" : "days"}</span>
          </div>
        )}
        <div>
          <span>{hours < 10 ? `0${hours}` : hours}</span>
          <span>{shortend ? "h" : "hrs"}</span>
        </div>
        <div>
          <span>{minutes < 10 ? `0${minutes}` : minutes}</span>
          <span> {shortend ? "m" : "mins"}</span>
        </div>
        <div>
          <span>{seconds < 10 ? `0${seconds}` : seconds}</span>
          <span>{shortend ? "s" : "secs"}</span>
        </div>
      </div>
    );
  }
};
const CountdownCard = ({ targetDate, shortend, showDays }) => {
  const convertDate = (date, tzString) => {
    return new Date(
      (typeof date === "string" ? new Date(date) : date).toLocaleString(
        "en-US",
        { timeZone: tzString }
      )
    );
  };
  return (
    <Countdown
      date={convertDate(targetDate)}
      renderer={(prev) => renderer({ ...prev, shortend, showDays })}
    />
  );
};

export default CountdownCard;
