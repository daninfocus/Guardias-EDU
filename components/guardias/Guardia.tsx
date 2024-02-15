import React, { useEffect, useState, Fragment, useContext } from "react";
import GuardiaModel from "../../@types/Guardia";
import AuthContext from "../../context/AuthContext";
import { datesAreOnSameDay, generateKey } from "../../logic/functions";
import FormContext from "../../context/FormContext";
import GuardiaSidebar from "./GuardiaSidebar";

type GuardiaProps = {
  guardias: Array<GuardiaModel>;
};

const Guardia: React.FC<GuardiaProps> = ({ guardias }) => {
  //context
  const TODAY = new Date();
  const { user, isUserAdmin } = useContext(AuthContext);
  const { isFormOpen, openForm, closeForm } = useContext(FormContext);

  const [openGuardias, setOpenGuardias] = useState(false);

  const openGuardia = (guardia: GuardiaModel) => {
    setOpenGuardias(!openGuardias);
  };

  const backgroundColor = (dim: boolean, guardia: GuardiaModel) => {
    if (guardia && guardia.dayOfGuardia) {
      if (guardia.color != null) {
        switch (guardia.color) {
          case 0:
            return (
              (!datesAreOnSameDay(guardia.dayOfGuardia, TODAY) &&
                dim &&
                "opacity-50") +
              " bg-custom-0 text-custom-6 border-custom-6 font-bold cursor-pointer border-l-4 hover:border-0 ease-in duration-100 rounded-lg w-full h-full p-2 pr-0 break-words overflow-x-hidden justify-items-stretch"
            );
          case 1:
            return (
              (!datesAreOnSameDay(guardia.dayOfGuardia, TODAY) &&
                dim &&
                "opacity-50") +
              " bg-custom-1 text-custom-7 border-custom-7 font-bold cursor-pointer border-l-4 hover:border-0 ease-in duration-100 rounded-lg w-full h-full p-2 pr-0 break-words overflow-x-hidden justify-items-stretch"
            );
          case 2:
            return (
              (!datesAreOnSameDay(guardia.dayOfGuardia, TODAY) &&
                dim &&
                "opacity-50") +
              " bg-custom-2 text-custom-8 border-custom-8 font-bold cursor-pointer border-l-4 hover:border-0 ease-in duration-100 rounded-lg w-full h-full p-2 pr-0 break-words overflow-x-hidden justify-items-stretch"
            );
          case 3:
            return (
              (!datesAreOnSameDay(guardia.dayOfGuardia, TODAY) &&
                dim &&
                "opacity-50") +
              " bg-custom-3 text-custom-9 border-custom-9 font-bold cursor-pointer border-l-4 hover:border-0 ease-in duration-100 rounded-lg w-full h-full p-2 pr-0 break-words overflow-x-hidden justify-items-stretch"
            );
          case 4:
            return (
              (!datesAreOnSameDay(guardia.dayOfGuardia, TODAY) &&
                dim &&
                "opacity-50") +
              " bg-custom-4 text-custom-10 border-custom-10 font-bold cursor-pointer border-l-4 hover:border-0 ease-in duration-100 rounded-lg w-full h-full p-2 pr-0 break-words overflow-x-hidden justify-items-stretch"
            );
          case 5:
            return (
              (!datesAreOnSameDay(guardia.dayOfGuardia, TODAY) &&
                dim &&
                "opacity-50") +
              " bg-custom-5 text-custom-11 border-custom-11 font-bold cursor-pointer border-l-4 hover:border-0 ease-in duration-100 rounded-lg w-full h-full p-2 pr-0 break-words overflow-x-hidden justify-items-stretch"
            );
        }
      }
    }
    return "font-bold cursor-pointer border-l-4 hover:border-0 ease-in duration-100 border-slate-500 text-slate-400  rounded-lg w-full h-full p-2 break-words overflow-hidden justify-items-stretch";
  };

  // useEffect(() => {
  //   if (!isFormOpen) {
  //     const getTeacher = async () => {
  //       let teachers = [];
  //       for (const guardia of guardias) {
  //         if (guardia) {
  //           let teacher = await getTeacherById(guardia.teacherDocId!);
  //           guardia.teacher = teacher as Teacher;
  //           teachers.push(teacher as Teacher);
  //         }
  //       }
  //       setTeacherLoaded([...teachers]);
  //     };
  //     if (teacherLoaded === undefined) getTeacher();
  //   }
  // }, [guardias]);

  if (!guardias || guardias.length == 0) return <></>;

  return (
    <>

      <div className={`flex-grow overflow-y-scroll`}>
        {guardias.map((element, index) => {
          return (
            <div
              key={generateKey(index)}
              className={`${guardias.length == 1 ? 'h-full' : 'h-min'} link link-underline link-underline-black overflow-y-scroll ${backgroundColor(
                true,
                element
              )} `}
              onClick={() => openGuardia(element)}
            >
              <p>{element.classroom}</p>
              <p>&nbsp;&nbsp;&nbsp;&nbsp;</p>
              
            </div>
          );
        })}
      </div>
      
      {guardias.length > 1 &&
        <div className="absolute top-0 right-[3.4rem] text-white font-bold flex flex-row justify-start items-center text-xs">
          <div className="flex  bg-red-400 rounded-full w-5 h-5 whitespace-nowrap">
            <div className="top-[2px] left-[6px] relative">
              {guardias.length}
              <span className="font-normal text-slate-600 underline ml-2">
                Guardia{guardias.length > 1 ? "s" : ""}
              </span>
            </div>
          </div>
        </div>
      }
      <div
        onClick={() => setOpenGuardias(false)}
        className={`navbar-backdrop fixed inset-0 bg-gray-800 transform duration-150 z-40 ${
          openGuardias ? "visible opacity-25" : "invisible opacity-0"
        }`}
      />

      <GuardiaSidebar
        openGuardias={openGuardias}
        guardias={guardias}
        backgroundColor={backgroundColor}
        openGuardia={openGuardia}
      />
    </>
  );
};

export default Guardia;
