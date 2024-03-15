import React, { useContext, useEffect, useState } from "react";

import { useRouter } from "next/router";
import GuardiasContext from "../context/GuardiasContext";
import College from "../@types/College";
import AuthContext from "../context/AuthContext";
import { deleteTeacherFromCollege } from "../firebase/firestore";
import FormContext from "../context/FormContext";
import Image from "next/image";
import { PrevButton } from "./nav/buttons/PrevButton";
import CalendarContext from "../context/CalendarContext";
import { NextButton } from "./nav/buttons/NextButton";
import GoToTodayButton from "./nav/buttons/GoToTodayButton";
import NavToggleButton from "./nav/NavToggleButton";
import NavSideBar from "./nav/NavSideBar";


const Nav = (prop: { simpleNav: boolean }) => {
  const router = useRouter();

  //context
  const { college, user, isUserAdmin } = useContext(AuthContext);
  const { isFormOpen, openForm, closeForm } = useContext(FormContext);
  const { goToNextWeek, goToPreviousWeek, goToToday} = useContext(CalendarContext);

  //state
  const [isNavOpen, setIsNavOpen] = useState(false);


  return (
    <div className="w-full">
      <nav className="relative px-3 py-2 grid justify-between items-center bg-gray-100 shadow-xl rounded-2xl"
        style={{
          gridTemplateColumns: "80px repeat(3, 1fr)",
        }}
      >
        <NavToggleButton setIsNavOpen={setIsNavOpen} isNavOpen={isNavOpen} />

        {!prop.simpleNav &&
          <div className="flex flex-row gap-2">
            <PrevButton goToPreviousWeek={goToPreviousWeek} />
            <GoToTodayButton goToToday={goToToday}/>
            <NextButton goToNextWeek={goToNextWeek} />
          </div>
        }
        
        <div className="flex flex-row justify-center">
          {!prop.simpleNav && college && college.name != "Cargando..." ? (
            <button
              className="shadow-md sm:block sm:visible hidden invisible text-xs sm:text-sm self-center  py-2 px-6 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition duration-200"
              type="button"
              onClick={() => {
                openForm(new Date());
                setIsNavOpen(false);
                router.push("/" + college.id);
              }}
            >
              Registrar Ausencia
            </button>
          ) : (
            <></>
          )}
        </div>
        <div className=" md:text-xl text-sm font-bold flex flex-row justify-end absolute right-10">
          {college.name}
        </div>
      </nav>

      <NavSideBar  setIsNavOpen={setIsNavOpen} isNavOpen={isNavOpen} />
    </div>
  );
};

export default Nav;
