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
            gridTemplateColumns: "auto repeat(" + (colNumber - 1) + ", 1fr)",
            gridTemplateRows: "50px 10px repeat(" + rowNumber + ", 1fr)",
            gridColumnGap: "0px",
            gridRowGap: "0px",
          }}
        >
          {/* First Cell */}
          <div
            className={
              monthLabelStyle()
                ? " bg-[#09a290] sm:text-xs text-[9px] font-medium text-white sm:p-2 p-1 pt-2 rounded-xl"
                : " sm:text-xs text-[9px] font-medium text-gray-900"
            }
          >
            {getMonthLabel(currentWeek[0])}
            <div>{currentWeek[0].getFullYear()}</div>
          </div>

          {/* Week Day Rows */}
          {currentWeek.map((item, index) => (
            <div
              key={generateKey(index)}
              className="text-xs font-medium text-gray-900 px-6 relative border-gray-200 border-r text-center pt-2"
            >
              {index == 0 && <PrevButton goToPreviousWeek={goToPreviousWeek} />}
              {days.weekDaysShortES[item.getDay()]}
              <div
                className={
                  datesAreOnSameDay(TODAY, item)
                    ? "text-white text-base bg-[#09a290]  rounded-md "
                    : "text-base h-[120%]"
                }
              >
                {item.getDate().toString()}
              </div>
              {index == currentWeek.length - 1 && (
                <NextButton goToNextWeek={goToNextWeek} />
              )}
            </div>
          ))}

          {/* Blank row under week days row */}
          <div className="border-gray-200 border-r"/>
          {currentWeek.map((item, index) => (
            <div
              key={generateKey(index)}
              className="border-r border-b"
            >
            </div>
          ))}
          
          {/* Time Slots Rows*/}
          {schedule.map((slot: any, indexRow: number) => (
            <React.Fragment key={generateKey(indexRow)}>
              <div className={`relative text-xs font-medium text-black sm:pl-2 border-gray-200 border-r`}>
                <span className="absolute -top-[6px]">{slot.start.hours + ":" + slot.start.minutes}</span>
              </div>

              {currentWeek.map((day, indexDay) => {
                return (
                  <div
                    key={generateKey(day)}
                    className={`overflow-hidden relative flex border-gray-200 border-r ${indexRow > 0 && 'border-t'}`}
                  >
                    {guardias[indexDay] && (
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
                    )}
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
      className="top-0 left-0 absolute w-full h-[120%] transition ease-in-out duration-200 text-lg text-gray-600 hover:shadow-2xl shadow-black group rounded-2xl flex flex-row items-center"
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
      className="top-0 left-0 absolute w-full h-[120%] flex justify-end transition ease-in-out delay-150 duration-200 text-lg text-gray-600 hover:shadow-2xl shadow-black group rounded-2xl flex-row items-center"
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
