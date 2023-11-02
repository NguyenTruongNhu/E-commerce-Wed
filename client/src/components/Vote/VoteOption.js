import React, { memo, useRef, useEffect, useState } from "react";
import logo from "assets/logo.png";
import { voteOptions } from "ultils/contants";
import { AiFillStar } from "react-icons/ai";
import { Button } from "components";
const VoteOption = ({ nameProduct, handleSubmitVoteOption }) => {
  const modalRef = useRef();
  const [chosenScore, setChosenScore] = useState(null);
  const [comment, setComment] = useState(null);
  useEffect(() => {
    modalRef.current.scrollIntoView({ block: "center", behavior: "smooth" });
  }, []);

  return (
    <div
      ref={modalRef}
      onClick={(e) => e.stopPropagation()}
      className="bg-white w-[700px]  p-4 flex flex-col gap-4 items-center justify-center"
    >
      <img src={logo} alt="logo" className="w-[300px] my-4  object-contain" />
      <h2 className="text-center font-medium text-lg">{`Voting product ${nameProduct}`}</h2>
      <textarea
        className="form-textarea w-full placeholder:italic placeholder:text-xs placeholder:text-gray-500 text-sm"
        placeholder="Type something"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      ></textarea>
      <div className="w-full flex flex-col gap-4">
        <p>How do you like this product?</p>
        <div className="flex items-center justify-center gap-4">
          {voteOptions.map((el) => (
            <div
              className="w-[100px] bg-gray-200 rounded-md hover:bg-gray-300 cursor-pointer p-4 h-[100px] flex items-center justify-center flex-col gap-2"
              key={el.id}
              onClick={() => setChosenScore(el.id)}
            >
              {Number(chosenScore) && chosenScore >= el.id ? (
                <AiFillStar color="orange" />
              ) : (
                <AiFillStar color="gray" />
              )}
              <span>{el.text}</span>
            </div>
          ))}
        </div>
      </div>
      <Button
        handleOnclick={() =>
          handleSubmitVoteOption({ comment, score: chosenScore })
        }
        fw
      >
        Submit
      </Button>
    </div>
  );
};

export default memo(VoteOption);
