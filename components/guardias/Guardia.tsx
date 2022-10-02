import React, { useEffect, useState, Fragment, useContext } from "react";
import GuardiaModel from "../../@types/Guardia";
import Image from "next/image";
import { Dialog, Transition } from "@headlessui/react";
import DropdownOptions from "../DropdownOptions";
import AuthContext from "../../context/AuthContext";
import GuardiasContext from "../../context/GuardiasContext";
import * as days from "../../shared/dates";
import {datesAreOnSameDay,generateKey} from "../../logic/functions";
import { getTeacherById, teacherRef } from "../../firebase/firestore";
import Teacher from "../../@types/Teacher";

const Guardia = (prop: { guardias: Array<GuardiaModel> }) => {
    
  //context
  const { user } = useContext(AuthContext);
  const { TODAY } = useContext(GuardiasContext);
  const { deleteSelectedGuardia } = useContext(GuardiasContext);
  const { openGuardiaToEdit } = useContext(GuardiasContext);
  const { setPressedNewGuardia } = useContext(GuardiasContext);
  const { isUserAdmin } = useContext(GuardiasContext);
  //state
  const [selectedGuardia, setSelectedGuardia] = useState<GuardiaModel>(
    prop.guardias[0]
  );
  const [isOpen, setIsOpen] = useState(false);
  const [teacherLoaded, setTeacherLoaded] = useState<Array<Teacher>|undefined>(undefined);

  //functions
  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  const openGuardia = (guardia: GuardiaModel) => {
    setSelectedGuardia(guardia);
    openModal();
  };

  const backgroundColor = () => {
   
    if (prop.guardias[0] && prop.guardias[0].dayOfGuardia && datesAreOnSameDay(prop.guardias[0].dayOfGuardia,TODAY)) {
      if (prop.guardias[0].color != null) {
        switch (prop.guardias[0].color) {
          case 0:
            return " bg-custom-0 text-custom-6 border-custom-6 font-bold cursor-pointer border-l-4 hover:border-0 ease-in duration-100 grid grid-cols-3 gap-1 rounded-lg w-full h-full p-2 break-words overflow-hidden justify-items-stretch";
          case 1:
            return " bg-custom-1 text-custom-7 border-custom-7 font-bold cursor-pointer border-l-4 hover:border-0 ease-in duration-100 grid grid-cols-3 gap-1 rounded-lg w-full h-full p-2 break-words overflow-hidden justify-items-stretch";
          case 2:
            return " bg-custom-2 text-custom-8 border-custom-8 font-bold cursor-pointer border-l-4 hover:border-0 ease-in duration-100 grid grid-cols-3 gap-1 rounded-lg w-full h-full p-2 break-words overflow-hidden justify-items-stretch";
          case 3:
            return " bg-custom-3 text-custom-9 border-custom-9 font-bold cursor-pointer border-l-4 hover:border-0 ease-in duration-100 grid grid-cols-3 gap-1 rounded-lg w-full h-full p-2 break-words overflow-hidden justify-items-stretch";
          case 4:
            return " bg-custom-4 text-custom-10 border-custom-10 font-bold cursor-pointer border-l-4 hover:border-0 ease-in duration-100 grid grid-cols-3 gap-1 rounded-lg w-full h-full p-2 break-words overflow-hidden justify-items-stretch";
          case 5:
            return " bg-custom-5 text-custom-11 border-custom-11 font-bold cursor-pointer border-l-4 hover:border-0 ease-in duration-100 grid grid-cols-3 gap-1 rounded-lg w-full h-full p-2 break-words overflow-hidden justify-items-stretch";
        }
      }
    }
    return "font-bold cursor-pointer border-l-4 hover:border-0 ease-in duration-100 border-slate-500 text-slate-400  grid grid-cols-3 gap-1 rounded-lg w-full h-full p-2 break-words overflow-hidden justify-items-stretch";
  };

  useEffect(()=>{
    const getTeacher = async ()=>{
      let teachers =[];
      for (const guardia of prop.guardias){
        let teacher = await getTeacherById(guardia.teacherDocId!);
        guardia.teacher=teacher as Teacher;
        teachers.push(teacher as Teacher)
      }
      setTeacherLoaded([...teachers]);
    }
    if(teacherLoaded===undefined)getTeacher()
  },[])

  if (prop.guardias[0].isEmpty || !teacherLoaded) return <></>;

  return (
    <div className={backgroundColor()}>
      <div className="text-white font-bold flex flex-row justify-start items-center text-xs h-5">
        <div className=" bg-red-400 rounded-full w-5 h-5">
          <div className="top-[2px] left-[6.5px] relative">
            {prop.guardias.length}{" "}
            <span className="font-medium text-slate-600 underline ml-2">
              Guardia{prop.guardias.length > 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </div>
      <div className="overflow-hidden col-span-3 max-h-28 flex flex-col justify-between">
        {prop.guardias.map((element, index) => {
          return (
            <div
              key={generateKey(index)}
              className="relative text-sm md:text-base flex flex-row justify-between link link-underline link-underline-black "
              onClick={() => openGuardia(element)}
            >
              <p>{element.classroom}</p>
              <p>&nbsp;&nbsp;&nbsp;&nbsp;</p>
              <p>{teacherLoaded![index].name?teacherLoaded![index].name:element.teacherEmail}</p>
            </div>
          );
        })}
      </div>
      <>
        <Transition appear show={isOpen} as={Fragment}>
          <Dialog as="div" className="relative z-10" onClose={closeModal}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black bg-opacity-25" />
            </Transition.Child>

            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4 text-center">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel className="h-full w-full max-w-md transform overflow-hidden rounded-2xl bg-white  text-left align-middle shadow-xl transition-all">
                    <div className="bg-slate-600 flex flex-row justify-between items-center shadow-xl w-full p-3 rounded-2xl">
                      <div className="h-8 w-1/6">
                        <Image
                          width="30"
                          height="30"
                          placeholder="blur"
                          blurDataURL="/profile_placeholder.png"
                          alt="icon"
                          src={
                            selectedGuardia.teacher
                              ? selectedGuardia.teacher.photo
                              : "/loading.gif"
                          }
                          className="-left-3 fixed rounded-2xl border-2 border-white ease-in duration-300"
                        />
                      </div>
                      <span className="text-sm font-thin text-white">
                        {
                          days.weekDaysLongES[
                            selectedGuardia?.dayOfGuardia.getDay()!
                          ]
                        }
                        :&nbsp;
                        {selectedGuardia?.dayOfGuardia.toLocaleDateString()}
                      </span>
                      {user && user.email == selectedGuardia.teacherEmail 
                      || isUserAdmin ? (
                        <DropdownOptions
                          labelFirstButton={"Editar"}
                          labelSecondButton={"Borrar"}
                          funcFirstButton={() => {
                            openGuardiaToEdit(selectedGuardia);
                            setPressedNewGuardia(false);
                          }}
                          funcSecondButton={() => {
                            deleteSelectedGuardia(selectedGuardia!);
                          }}
                          simple={false}
                        />
                      ) : (
                        <></>
                      )}
                    </div>
                    <Dialog.Title
                      as="h3"
                      className="text-lg p-6 font-medium leading-6 text-gray-900 flex flex-col justify-between mt-3"
                    >
                      <div>
                        <span className=" font-thin">Profesor/a: &nbsp;</span>
                        {selectedGuardia.teacher?selectedGuardia.teacher!.name:selectedGuardia.teacherEmail}
                      </div>
                      <div className="text-base self-end">
                        <span className=" font-thin">Clase: &nbsp;</span>
                        {selectedGuardia?.classroom}
                      </div>
                      <div className="mt-2 font-medium text-base">
                        Tareas:
                        <p className="ml-4 text-sm text-gray-500">
                          {selectedGuardia?.tasks}
                        </p>
                      </div>
                      {selectedGuardia!.moreInfo!.length > 0 ? (
                        <div className="mt-2 font-medium text-base">
                          Aula:
                          <p className="ml-4 text-sm text-gray-500 ">
                            {selectedGuardia?.moreInfo}
                          </p>
                        </div>
                      ) : (
                        <></>
                      )}
                    </Dialog.Title>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      </>
    </div>
  );
};

export default Guardia;
