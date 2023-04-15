import React from "react";

export const RecievedBubble = ({ image, text, name }) => {
  return (
    <>
      <div className="relative flex gap-3 items-center">
        <img className="rounded-full w-10 self-end" src={image} alt="" />
        <div className="flex flex-col items-start">
          <div className="bg-slate-600/80 text-white min-w-[100px] max-w-[290px] p-3 rounded-3xl rounded-bl-none  break-words">
            <p>{text}</p>
          </div>
        </div>
        <p className="absolute -bottom-5 left-14 text-sm text-gray-400">
          {name}
        </p>
      </div>
    </>
  );
};
