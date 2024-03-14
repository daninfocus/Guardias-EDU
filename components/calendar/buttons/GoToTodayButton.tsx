import React from 'react'

const GoToTodayButton = ({ goToToday }: any) => {
  return (
    <button
        className=" h-[120%] flex justify-end transition ease-in-out delay-150 duration-200 text-lg text-gray-600 hover:shadow-2xl shadow-black group rounded-2xl flex-row items-center"
        onClick={() => goToToday()}
      >
        Today
      </button>
  )
}

export default GoToTodayButton