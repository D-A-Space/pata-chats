import React from "react";

const SentBubble = ({ image, text, name }) => {
  return (
    <>
      <div className="">
        <img
          className="rounded-full"
          src={image}
          alt="contact me at 0778086316"
        />
        <div className="">
          <p>{name}</p>
          <p>{text}</p>
        </div>
      </div>
    </>
  );
};

export default SentBubble;
