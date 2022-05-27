import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import GuardiaModel from "../../models/Guardia";
import * as days from "../../shared/dates";
import Guardia from "../guardias/Guardia";

const MainCalendar = (props: {
  guardias: Array<Array<Array<GuardiaModel>>>;
}) => {
  const COLS = 6;
  const ROWS = 6;
  const TODAY = new Date();
  const [week, setWeek] = useState<Array<Date>>([TODAY]);
  const [day, setDay] = useState<Date>(TODAY);
  const [weekPos, setWeekPos] = useState<number>(0);

  const createWeek = (daysInWeek = COLS - 1) => {
    let week = [];
    var nextWeekDate = new Date(TODAY.getTime());
    var today =
      weekPos != 0
        ? new Date(nextWeekDate.setDate(day.getDate() + weekPos * 7))
        : new Date(TODAY.getTime());
    for (let i = 1; i < daysInWeek + 1; i++) {
      const dayNum = today.getDate() - today.getDay() + i;
      const date = new Date(today.setDate(dayNum));
      week.push(date);
    }
    setWeek([...week]);
  };

  const isGuardiaInCurrentWeek = (guardia: GuardiaModel) => {
    if (guardia.id != "empty") {
      //if year is with-in the week
      if (
        guardia.dayOfGuardia.getFullYear() == week[0].getFullYear() ||
        guardia.dayOfGuardia.getFullYear() ==
          week[week.length - 1].getFullYear()
      ) {
        //if the month is with-in the week
        if (
          guardia.dayOfGuardia.getMonth() == week[0].getMonth() ||
          guardia.dayOfGuardia.getMonth() == week[week.length - 1].getMonth()
        ) {
          //if date in month is with-in the week
          if (
            guardia.dayOfGuardia.getDate() >= week[0].getDate() &&
            guardia.dayOfGuardia.getDate() <= week[week.length - 1].getDate()
          ) {
            return true;
          }
        }
      }
    }
    return false;
  };

  const incrementWeek = () => {
    setWeekPos(weekPos + 1);
  };

  const decrementWeek = () => {
    setWeekPos(weekPos - 1);
  };

  useEffect(() => {
    createWeek();
  }, [weekPos]);

  return (
    <div className="flex flex-col w-full h-full">
      <div className="w-full flex flex-row justify-between items-center">
        <button
          className="text-lg text-gray-600 hover:bg-gray-500 hover:text-gray-100 rounded-2xl p-3 flex flex-row items-center"
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
            week[0].getMonth() === day.getMonth() &&
            week[0].getFullYear() == day.getFullYear()
              ? "sm:hidden rounded-2xl  p-1 bg-[#09a290] text-xs font-medium text-white"
              : "sm:hidden border-r text-xs font-medium text-gray-900"
          }
        >
          {days.monthNamesES[week[0].getMonth()]}-{week[0].getFullYear()}
        </div>
        <button
          className="text-lg text-gray-600 hover:bg-gray-500 hover:text-gray-100 rounded-2xl p-3 flex flex-row items-center"
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
            <thead className="border-b">
              <tr className="h-10">
                <th
                  scope="col"
                  className={
                    week[0].getMonth() === day.getMonth() &&
                    week[0].getFullYear() == day.getFullYear()
                      ? "rounded-2xl w-[4%] bg-[#09a290] text-xs font-medium text-white first-column"
                      : "border-r w-[4%] text-xs font-medium text-gray-900 first-column"
                  }
                >
                  {days.monthNamesES[week[0].getMonth()]}
                  <div>{week[0].getFullYear()}</div>
                </th>
                {week.map((item, index) => {
                  return (
                    <th
                      key={index.toString()}
                      scope="col"
                      className="border-r w-1/12 text-xs font-medium text-gray-900 px-6 h-20"
                    >
                      {days.weekDaysShortES[index]}
                      <div
                        className={
                          day.getDate() === item.getDate() &&
                          day.getMonth() === item.getMonth() &&
                          day.getFullYear() === item.getFullYear()
                            ? "selected-day m-auto text-2xl text-white mt-2"
                            : "text-2xl mt-2 h-[35px]"
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
              {props.guardias.map((row, indexRow) => {
                return (
                  <tr className="border-b" key={indexRow}>
                    <td className=" first-column border-r w-[4%] px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {indexRow + 1}
                    </td>
                    {row.map((col, indexCol) => {
                      if (isGuardiaInCurrentWeek(col[0])) {
                        return (
                          <td
                            key={col[0].id}
                            className="border-r w-1/12 text-sm text-gray-900 font-light whitespace-nowrap"
                          >
                            <Guardia guardias={col} />
                          </td>
                        );
                      } else {
                        return <></>;
                      }
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
