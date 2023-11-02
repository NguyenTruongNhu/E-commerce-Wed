import React, { memo } from "react";

const SelectQuantity = ({ quantity, handleQuantity, handleChangeQuantity }) => {
  return (
    <div className="flex items-center">
      <span
        onClick={() => handleChangeQuantity("minus")}
        className=" p-2 cursor-pointer border-r border-black"
      >
        -
      </span>
      <input
        type="text"
        className="py-2 text-center outline-none w-[50px]"
        value={quantity}
        onChange={(e) => handleQuantity(e.target.value)}
      />
      <span
        onClick={() => handleChangeQuantity("plus")}
        className=" p-2 cursor-pointer border-l border-black"
      >
        +
      </span>
    </div>
  );
};

export default memo(SelectQuantity);
