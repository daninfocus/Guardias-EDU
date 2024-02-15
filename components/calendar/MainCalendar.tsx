import React, { CSSProperties, useContext, useEffect, useState } from "react";
import "react-calendar/dist/Calendar.css";
import GuardiasContext from "../../context/GuardiasContext";
import GuardiaModel from "../../@types/Guardia";
import * as days from "../../shared/dates";
import Guardia from "../guardias/Guardia";
import { generateKey, datesAreOnSameDay } from "../../logic/functions";
import HashLoader from "react-spinners/HashLoader";
import useCalendar from "../../context/CalendarContext";
import useGuardias from "../../hooks/useGuardias";
import CalendarContext from "../../context/CalendarContext";
import CellButton from "../CellButton";
import { PlusCircleIcon } from "@heroicons/react/solid";
import FormContext from "../../context/FormContext";

const MainCalendar = () => {
  //context
  const { guardias, addOrUpdateGuardia, removeGuardia, saveGuardia } =
    useContext(GuardiasContext);
  const {
    currentWeek,
    goToNextWeek,
    goToPreviousWeek,
    getGuardiasInSlot,
    firstDayOfWeek,
    showWeekends,
    hoursInDay,
    schedule,
  } = useContext(CalendarContext);
  const { isFormOpen, openForm, closeForm } = useContext(FormContext);
  const weekLength = showWeekends ? 7 : 5;

  const TODAY = new Date();

  //functions
  const getMonthLabel = (date: Date) => {
    return days.shortMonthNamesES[date.getMonth()];
  };

  const monthLabelStyle = () => {
    return (
      (currentWeek[0].getMonth() === TODAY.getMonth() &&
        currentWeek[0].getFullYear() == TODAY.getFullYear()) ||
      (currentWeek[3].getMonth() === TODAY.getMonth() &&
        currentWeek[3].getFullYear() == TODAY.getFullYear())
    );
  };

  const rowNumber = schedule ? schedule.length : 2;
  const colNumber = currentWeek.length + 1;

  if (currentWeek.length == 0 || guardias.length == 0) {
    return <></>;
  } else {
    return (
      <div className="w-full grow min-h-0">
        {guardias.length === 0 && (
          <div className="z-40 absolute top-0 flex flex-col h-full w-full items-center justify-center">
            <HashLoader color="#36d7b7" />
          </div>
        )}

        {/* Table */}
        <div
          className={`h-full w-full box-border relative`}
          style={{
            display: "grid",
            gridTemplateColumns: "50px repeat(" + (colNumber - 1) + ", 1fr)",
            gridTemplateRows: "50px repeat(" + rowNumber + ", 1fr)",
            gridColumnGap: "0px",
            gridRowGap: "0px",
          }}
        >
          {/* First Cell */}
          <div
            className={
              monthLabelStyle()
                ? " bg-[#09a290] text-xs font-medium text-white p-1 rounded-xl"
                : " text-xs font-medium text-gray-900"
            }
          >
            {getMonthLabel(currentWeek[0])}
            <div>{currentWeek[0].getFullYear()}</div>
          </div>

          {/* Week Day Columns */}
          {currentWeek.map((item, index) => (
            <div
              key={generateKey(index)}
              className=" text-xs font-medium text-gray-900 px-6 border-gray-200 border-t border-r border-[1px] relative"
            >
              {index == 0 && <PrevButton goToPreviousWeek={goToPreviousWeek} />}
              {days.weekDaysShortES[item.getDay()]}
              <div
                className={
                  datesAreOnSameDay(TODAY, item)
                    ? "text-white text-base bg-[#09a290] p-1 rounded-md"
                    : "text-base"
                }
              >
                {item.getDate().toString()}
              </div>
              {index == currentWeek.length - 1 && (
                <NextButton goToNextWeek={goToNextWeek} />
              )}
            </div>
          ))}
          {/* Time Slots Rows*/}
          {schedule.map((slot: any, indexRow: number) => (
            <React.Fragment key={generateKey(indexRow)}>
              <div className=" text-xs font-medium text-black left-0 border-gray-200 border-t border-r ">
                {slot.start.hours + ":" + slot.start.minutes}
              </div>

              {currentWeek.map((day, indexDay) => {
                return (
                  <div
                    key={generateKey(day)}
                    className=" border-gray-200 border-t border-r overflow-hidden relative flex"
                  >
                    {/* {guardias[indexDay] && ( */}
                    <>
                      <Guardia guardias={guardias[indexDay][indexRow]} />

                      <div
                        className={`${
                          guardias[indexDay][indexRow] &&
                          guardias[indexDay][indexRow].length > 0
                            ? "w-1/3"
                            : "w-full"
                        } h-full hover:bg-zinc-300 hover:cursor-pointer rounded-md flex items-center justify-center group`}
                        onClick={() => {
                          day.setHours(slot.start.hours);
                          day.setMinutes(slot.start.minutes + 1);
                          day.setSeconds(0);
                          openForm();
                        }}
                      >
                        <span className="group-hover:visible invisible text-white text-xl">
                          +
                        </span>
                      </div>
                    </>
                    {/* )} */}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  }
};

export default MainCalendar;

const PrevButton = ({ goToPreviousWeek }: any) => {
  return (
    <button
      className="top-0 left-0 absolute w-full h-full transition ease-in-out duration-200 text-lg text-gray-600 hover:shadow-2xl shadow-black group rounded-2xl flex flex-row items-center"
      onClick={() => goToPreviousWeek()}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 group-hover:h-8 group-hover:w-8 transform transition-all ease-in-out duration-200"
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

const NextButton = ({ goToNextWeek }: any) => {
  return (
    <button
      className="top-0 left-0 absolute w-full h-full flex justify-end transition ease-in-out delay-150 duration-200 text-lg text-gray-600 hover:shadow-2xl shadow-black group rounded-2xl flex-row items-center"
      onClick={() => goToNextWeek()}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 group-hover:h-8 group-hover:w-8 transform transition-all ease-in-out duration-200"
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
