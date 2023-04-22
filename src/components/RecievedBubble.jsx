import React from "react";
import { isArabic } from "../helpers/helpers";

export const RecievedBubble = ({ image, text, name }) => {
  return (
    <>
      <div
        className={`relative flex gap-3 items-center ${
          isArabic(text) ? "text-right" : "text-left"
        } `}
      >
        <img className="rounded-full w-10 self-end" src={image} alt="" />
        <div className="flex flex-col items-start">
          <div className="bg-slate-600/80 text-white max-w-[290px] p-3 rounded-3xl rounded-bl-none  break-words">
            <p style={{ direction: isArabic(text) ? "rtl" : "ltr" }}>{text}</p>
          </div>
        </div>
        <p className="absolute whitespace-nowrap -bottom-5 left-14 text-sm text-gray-400">
          {name}
        </p>
      </div>
    </>
  );
};
