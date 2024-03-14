import React from "react";

export const PrevButton = ({ goToPreviousWeek }: any) => {
    return (
      <button
        className="text-lg text-gray-600 hover:shadow-2xl shadow-black group rounded-2xl flex flex-row items-center"
        onClick={() => goToPreviousWeek()}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
          />
        </svg>
      </button>
    );
  };