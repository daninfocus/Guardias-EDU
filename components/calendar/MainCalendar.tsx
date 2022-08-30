import React, { useContext, useEffect, useState } from "react";
import "react-calendar/dist/Calendar.css";
import GuardiasContext from "../../context/GuardiasContext";
import GuardiaModel from "../../@types/Guardia";
import * as days from "../../shared/dates";
import Guardia from "../guardias/Guardia";
import {generateKey,datesAreOnSameDay} from "../../logic/functions";

const MainCalendar = () => {

  //context 
  const { week } = useContext(GuardiasContext);
  const { decrementWeek } = useContext(GuardiasContext);
  const { incrementWeek } = useContext(GuardiasContext);
  const { guardias } = useContext(GuardiasContext);
  const { COLS } = useContext(GuardiasContext);
  const { TODAY } = useContext(GuardiasContext);
  const { isGuardiaInCurrentWeek } = useContext(GuardiasContext);

  //functions

  const getMonthLabel = () => {
    if (week[0].getMonth() != week[COLS - 2].getMonth()) {
      return (
        days.monthNamesES[week[0].getMonth()] +
        "-" +
        days.monthNamesES[week[4].getMonth()]
      );
    } else {
      return days.monthNamesES[week[0].getMonth()];
    }
  };

  const monthLabelStyle = () => {
    return (
      (week[0].getMonth() === TODAY.getMonth() &&
        week[0].getFullYear() == TODAY.getFullYear()) ||
      (week[COLS - 2].getMonth() === TODAY.getMonth() &&
        week[COLS - 2].getFullYear() == TODAY.getFullYear())
    );
  };

  return (
    <div className="flex flex-col w-full h-full overflow-y-scroll sm:overflow-x-hidden sm:overflow-y-hidden">
      <div className="w-full flex flex-row justify-between items-center">
        <button
          className="transition ease-in-out duration-200 text-lg text-gray-600 hover:bg-gray-500 hover:text-gray-100 rounded-2xl p-3 flex flex-row items-center"
          onClick={() => decrementWeek()}
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
          Anterior
        </button>
        <div
          className={
            monthLabelStyle()
              ? "sm:hidden rounded-2xl  p-1 bg-[#09a290] text-xs font-medium text-white"
              : "sm:hidden border-r text-xs font-medium text-gray-900"
          }
        >
          {getMonthLabel()}-{week[0].getFullYear()}
        </div>
        <button
          className="transition ease-in-out delay-150 duration-200 text-lg text-gray-600 hover:bg-gray-500 hover:text-gray-100 rounded-2xl p-3 flex flex-row items-center"
          onClick={() => incrementWeek()}
        >
          Siguiente
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
      </div>

      <div className="sm:-mx-6 lg:-mx-8 h-full">
        <div className="inline-block min-w-full h-full sm:px-6 lg:px-8">
          <table className="min-w-full table-auto h-full w-full">
            <thead className="border-b border-t">
              <tr className="h-6 ">
                <th
                  scope="col"
                  className={
                    monthLabelStyle()
                      ? "rounded-2xl w-[4%] bg-[#09a290] text-xs font-medium text-white first-column"
                      : "border-r w-[4%] text-xs font-medium text-gray-900 first-column"
                  }
                >
                  {getMonthLabel()}
                  <div>{week[0].getFullYear()}</div>
                </th>
                {week.map((item, index) => {
                  return (
                    <th
                      key={generateKey(index)}
                      scope="col"
                      className="border-r w-1/12 text-xs font-medium text-gray-900 px-6 h-full md:h-20"
                    >
                      {days.weekDaysShortES[index]}
                      <div
                        className={
                            datesAreOnSameDay(TODAY,item)
                            ? "selected-day m-auto text-2xl text-white mt-2"
                            : "md:text-2xl text-base mt-2 h-[35px]"
                        }
                      >
                        {item.getDate().toString()}
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="h-full">
              {guardias.map((row, indexRow) => {
                return (
                  <tr className="border-b h-24" key={generateKey(indexRow)}>
                    <td className="items-center text-center first-column border-r w-[4%] px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {indexRow + 1}º
                    </td>
                    {row.map((col, colIndex) => {
                      return (
                        <td
                          key={generateKey(colIndex)}
                          className="border-r w-1/12 text-sm text-gray-900 font-light whitespace-nowrap"
                        >
                          {isGuardiaInCurrentWeek(col[0]) ? (
                            <Guardia
                              guardias={col}
                            />
                          ) : (
                            <></>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MainCalendar;
