import React, { useEffect, useState } from "react";
import "react-calendar/dist/Calendar.css";
import GuardiaModel from "../../models/Guardia";
import * as days from "../../shared/dates";
import Guardia from "../guardias/Guardia";

const MainCalendar = (props: {
  guardias: Array<Array<Array<GuardiaModel>>>;
  COLS: number;
  ROWS: number;
  TODAY: Date;
  week: Array<Date>;
  setWeek: Function;
  isGuardiaInCurrentWeek: Function;
  deleteGuardia:Function;
  editGuardia:Function;
}) => {
  const [day, setDay] = useState<Date>(props.TODAY);
  const [weekPos, setWeekPos] = useState<number>(0);

  const createWeek = (daysInWeek = props.COLS - 1) => {
    let week = [];
    var nextWeekDate = new Date(props.TODAY.getTime());
    var today =
      weekPos != 0
        ? new Date(nextWeekDate.setDate(day.getDate() + weekPos * 7))
        : new Date(props.TODAY.getTime());
    for (let i = 1; i < daysInWeek + 1; i++) {
      const dayNum = today.getDate() - today.getDay() + i;
      const date = new Date(today.setDate(dayNum));
      week.push(date);
    }
    props.setWeek([...week]);
  };

  const getMonthLabel = () => {
    if (props.week[0].getMonth() != props.week[props.COLS - 2].getMonth()) {
      return (
        days.monthNamesES[props.week[0].getMonth()] +
        "-" +
        days.monthNamesES[props.week[4].getMonth()]
      );
    } else {
      return days.monthNamesES[props.week[0].getMonth()];
    }
  };

  const monthLabelStyle = () => {
    return (
      (props.week[0].getMonth() === day.getMonth() &&
        props.week[0].getFullYear() == day.getFullYear()) ||
      (props.week[props.COLS - 2].getMonth() === day.getMonth() &&
        props.week[props.COLS - 2].getFullYear() == day.getFullYear())
    );
  };

  const incrementWeek = () => {
    setWeekPos(weekPos + 1);
  };

  const decrementWeek = () => {
    setWeekPos(weekPos - 1);
  };

  useEffect(() => {
    createWeek();
  }, [weekPos,createWeek]);

  const generateKey = (pre: any) => {
    return `${pre}_${new Date().getTime()}`;
  };

  return (
    <div className="flex flex-col w-full h-full overflow-y-scroll sm:overflow-hidden">
      <div className="w-full flex flex-row justify-between items-center">
        <button
          className="transition ease-in-out delay-150  hover:translate-y-1 hover:translate-x-2  hover:scale-110  duration-200 text-lg text-gray-600 hover:bg-gray-500 hover:text-gray-100 rounded-2xl p-3 flex flex-row items-center"
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
          {getMonthLabel()}-{props.week[0].getFullYear()}
        </div>
        <button
          className="transition ease-in-out delay-150  hover:translate-y-1 hover:-translate-x-2  hover:scale-110  duration-200 text-lg text-gray-600 hover:bg-gray-500 hover:text-gray-100 rounded-2xl p-3 flex flex-row items-center"
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
              <tr className="h-6">
                <th
                  scope="col"
                  className={
                    monthLabelStyle()
                      ? "rounded-2xl w-[4%] bg-[#09a290] text-xs font-medium text-white first-column"
                      : "border-r w-[4%] text-xs font-medium text-gray-900 first-column"
                  }
                >
                  {getMonthLabel()}
                  <div>{props.week[0].getFullYear()}</div>
                </th>
                {props.week.map((item, index) => {
                  return (
                    <th
                      key={generateKey(index)}
                      scope="col"
                      className="border-r w-1/12 text-xs font-medium text-gray-900 px-6 h-full md:h-20"
                    >
                      {days.weekDaysShortES[index]}
                      <div
                        className={
                          day.getDate() === item.getDate() &&
                          day.getMonth() === item.getMonth() &&
                          day.getFullYear() === item.getFullYear()
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
              {props.guardias.map((row, indexRow) => {
                return (
                  <tr className="border-b h-24" key={generateKey(indexRow)}>
                    <td className=" first-column border-r w-[4%] px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {indexRow + 1}
                    </td>
                    {row.map((col, colIndex) => {
                      return (
                        <td
                          key={generateKey(colIndex)}
                          className="border-r w-1/12 text-sm text-gray-900 font-light whitespace-nowrap"
                        >
                          {props.isGuardiaInCurrentWeek(col[0]) ? (
                            <Guardia guardias={col} deleteGuardia={props.deleteGuardia} editGuardia={props.editGuardia}/>
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
