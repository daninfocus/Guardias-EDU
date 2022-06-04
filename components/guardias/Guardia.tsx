import React, { useEffect, useState, Fragment, useContext } from "react";
import GuardiaModel from "../../models/Guardia";
import { getProfilePhotoWithTeacherid } from "../../firebase/firestore";
import Image from "next/image";
import { Dialog, Transition } from "@headlessui/react";
import DropdownOptions from "../DropdownOptions";
import AuthContext from "../../store/auth.context";
import * as days from "../../shared/dates";

const Guardia = (prop: {
  guardias: Array<GuardiaModel>;
  deleteGuardia: Function;
  editGuardia: Function;
}) => {
  const { user } = useContext(AuthContext);

  const [image, setImage] = useState<string>("/loading.gif");

  const [selectedGuardia, setSelectedGuardia] = useState<GuardiaModel>();

  let [isOpen, setIsOpen] = useState(false);

  const getTeacherProfileIcon = (guardia: GuardiaModel | undefined) => {
    if (guardia != null) {
      getProfilePhotoWithTeacherid(guardia.teacherId).then((data) =>
        setImage(data)
      );
    }

    return image;
  };

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

  const generateKey = (pre: any) => {
    return `${pre}_${new Date().getTime()}`;
  };

  const backgroundColor = () => {
    if (prop.guardias[0].color != null) {
      switch (prop.guardias[0].color) {
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
    return "font-bold cursor-pointer border-l-4 hover:border-0 ease-in duration-100 border-slate-500 text-slate-400  grid grid-cols-3 gap-1 rounded-lg w-full h-full p-2 break-words overflow-hidden justify-items-stretch";
  };

  if (prop.guardias[0].id == "empty") return <></>;

  return (
    <div className={backgroundColor()}>
      <div className="col-span-2 h-7 relative "></div>
      <div className="text-white font-bold flex flex-row justify-end items-center text-xs h-5">
        <div className=" bg-red-400 rounded-full w-5 h-5">
          <div className="top-[2px] left-[6.5px] relative">
            {prop.guardias.length}
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
              <p>{element.teacherName}</p>
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
                          src={getTeacherProfileIcon(selectedGuardia)}
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
                      {user.uid == selectedGuardia?.teacherId ? (
                        <DropdownOptions
                          deleteGuardia={() =>
                            prop.deleteGuardia(selectedGuardia!)
                          }
                          editGuardia={() =>
                            prop.editGuardia(selectedGuardia!)
                          }
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
                        {selectedGuardia?.teacherName}
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
                      <div className="mt-2 font-medium text-base">
                        Información adicional:
                        <p className="ml-4 text-sm text-gray-500 ">
                          {selectedGuardia?.moreInfo}
                        </p>
                      </div>
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
