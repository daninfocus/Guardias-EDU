import React, { useEffect, useState, Fragment } from "react";
import GuardiaModel from "../../models/Guardia";
import { getProfilePhotoWithTeacherid } from "../../firebase/firestore";
import Image from "next/image";
import { Dialog, Transition } from "@headlessui/react";

const Guardia = (prop: { guardias: Array<GuardiaModel> }) => {
  const [images, setImage] = useState<Array<string>>([]);

  const [selectedGuardia, setSelectedGuardia] = useState<GuardiaModel>();

  let [isOpen, setIsOpen] = useState(false);

  const getTeacherProfileIcons = async () => {
    var iconsArray: Array<string> = [];
    for (const element of prop.guardias) {
      var image = await getProfilePhotoWithTeacherid(element.teacherId);
      iconsArray.push(image);
    }
    setImage([...iconsArray]);
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

  useEffect(() => {
    getTeacherProfileIcons();
  }, []);

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

  if (prop.guardias[0].id == "empty") {
    return <></>;
  } else {
    return (
      <div className={backgroundColor()}>
        <div className="col-span-2 h-7 relative ">
          {images.map((element, index) => {
            return (
              <Image
                width={28}
                height={28}
                alt="icon"
                key={generateKey(index)}
                src={element}
                className="-left-3 rounded-2xl border-2 border-white"
              ></Image>
            );
          })}
        </div>
        <div className="text-white font-bold flex flex-row justify-end items-center text-xs h-7">
          <div className=" bg-red-400 rounded-full w-7 h-7">
            <div className="top-[5px] left-[10px] relative">
              {prop.guardias.length}
            </div>
          </div>
        </div>
        <div className="overflow-hidden col-span-3 max-h-28 flex flex-col justify-between">
          {prop.guardias.map((element, index) => {
            return (
              <div
                key={generateKey(index)}
                className="flex flex-row justify-between "
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
                    <Dialog.Panel className="h-full w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                      <Dialog.Title
                        as="h3"
                        className="text-lg font-medium leading-6 text-gray-900 flex flex-row justify-between"
                      >
                        <div>{selectedGuardia?.teacherName}</div>
                        <div>{selectedGuardia?.classroom}</div>
                      </Dialog.Title>
                      <div className="mt-2">
                        Tareas:
                        <p className="text-sm text-gray-500">
                          {selectedGuardia?.tasks}
                        </p>
                      </div>
                      <div className="mt-2 h-full">
                        Información adicional:
                        <p className="text-sm text-gray-500 ">
                          sdasdasdasddasdasdasddasdasdasddasdasdasddasdasdasddasdasdasddasdasdasddasdasdasddasdasdasddasdasdasddasdasdasd
                        </p>
                      </div>

                      {/* <div className="mt-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={closeModal}
                    >
                      Got it, thanks!
                    </button>
                  </div> */}
                    </Dialog.Panel>
                  </Transition.Child>
                </div>
              </div>
            </Dialog>
          </Transition>
        </>
      </div>
    );
  }
};

export default Guardia;
