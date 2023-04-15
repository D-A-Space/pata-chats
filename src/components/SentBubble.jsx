import React from "react";

const SentBubble = ({ image, text, name }) => {
  return (
    <>
      <div className="relative flex gap-3 items-center">
        <div className="flex flex-col items-end">
          <div className="bg-violet-500 text-white min-w-[100px] max-w-[290px] p-3 rounded-3xl rounded-br-none break-words">
            <p>{text}</p>
          </div>
        </div>
        <a className="rounded-full w-10 self-end" href={image} download>
          <img src={image} alt="" />
        </a>

        <p className="absolute -bottom-5 right-14 text-sm text-gray-400">you</p>
      </div>
    </>
  );
};

export default SentBubble;
