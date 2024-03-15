import React from 'react'

const GoToTodayButton = ({ goToToday }: any) => {
  return (
    <button
        className=" h-[120%] text-lg text-gray-600 hover:shadow-md p-2 group rounded-2xl flex flex-row items-center"
        onClick={() => goToToday()}
      >
        Hoy
      </button>
  )
}

export default GoToTodayButton