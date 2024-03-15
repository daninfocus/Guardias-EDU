import React from "react";

export const NextButton = ({ goToNextWeek }: any) => {
    return (
      <button
        className="text-lg text-gray-600 hover:shadow-md p-2 group rounded-2xl flex flex-row items-center"
        onClick={() => goToNextWeek()}
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
            d="M13 5l7 7-7 7M5 5l7 7-7 7"
          />
        </svg>
      </button>
    );
  };
  