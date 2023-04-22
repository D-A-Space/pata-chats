import React from "react";
import { isArabic } from "../helpers/helpers";

const SentBubble = ({ image, text, name }) => {
  return (
    <>
      <div
        className={`relative flex gap-3 items-center ${
          isArabic(text) ? "text-right" : "text-left"
        } `}
      >
        <div className="flex flex-col items-end">
          <div className="bg-violet-500 text-white w-fit max-w-[290px] p-3 rounded-3xl rounded-br-none break-words">
            <p style={{ direction: isArabic(text) ? "rtl" : "ltr" }}>{text}</p>
          </div>
        </div>

        <img className="rounded-xl w-10 self-end" src={image} alt="" />

        <p className="absolute whitespace-nowrap -bottom-5 right-14 text-sm text-gray-400">
          you
        </p>
      </div>
    </>
  );
};

export default SentBubble;
