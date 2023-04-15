import React from "react";

const SentBubble = ({ image, text, name }) => {
  return (
    <>
      <div className="relative flex gap-3 items-center">
        <div className="flex flex-col items-end">
          <div className="bg-violet-500 text-white w-fit max-w-[290px] p-3 rounded-3xl rounded-br-none break-words">
            <p>{text}</p>
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
