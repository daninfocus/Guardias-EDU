import React, { useState, useContext, useEffect } from "react";
import { useRouter } from "next/router";
import {
  addDocument,
  getCollegeDataById,
  getNoLoginUrlByUrl,
} from "../../firebase/firestore";
import GuardiasContext from "../../context/GuardiasContext";
import "react-calendar/dist/Calendar.css";
import GuardiaModel from "../../@types/Guardia";
import * as days from "../../shared/dates";
import Guardia from "../../components/guardias/Guardia";
import { generateKey, datesAreOnSameDay } from "../../logic/functions";
import CollegeModel from "../../@types/College";

const NoLoginPage = () => {
  //context
  const { week } = useContext(GuardiasContext);
  const { college } = useContext(GuardiasContext);
  const { setCollege } = useContext(GuardiasContext);
  const { setCollegeId } = useContext(GuardiasContext);
  const { guardias } = useContext(GuardiasContext);
  const { COLS } = useContext(GuardiasContext);
  const { TODAY } = useContext(GuardiasContext);
  const { isGuardiaInCurrentWeek } = useContext(GuardiasContext);
  const router = useRouter();


  const getData = async () => {
    let url = router.asPath.split("/")[2];
    let existingUrls = await getNoLoginUrlByUrl(url);
    
    if (existingUrls[0]) {
      let collegeId = existingUrls[0].data().collegeId;
      const response = await getCollegeDataById(collegeId.toString());
      if (response != undefined) {
        let college = response as CollegeModel;
        setCollege(college);
        console.log(collegeId);
        setCollegeId(collegeId)
      }
    }
  };
  

  useEffect(() => {
    getData();
  }, [router.asPath]);

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
  if (college && guardias) {
    return (
      <div className="flex flex-col w-full h-screen overflow-y-scroll sm:overflow-x-hidden sm:overflow-y-hidden">
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
                            datesAreOnSameDay(TODAY, item)
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
                              <Guardia guardias={col} />
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
  }
};

export default NoLoginPage;
