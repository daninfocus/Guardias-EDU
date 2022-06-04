import { User } from "firebase/auth";
import React, {
  Fragment,
  SyntheticEvent,
  useContext,
  useEffect,
  useState,
} from "react";
import Calendar from "react-calendar";
import { addDocument } from "../../firebase/firestore";
import College from "../../models/College";
import Guardia from "../../models/Guardia";
import toast, { Toaster } from "react-hot-toast";
import router, { useRouter } from "next/router";
import AuthContext from "../../store/auth.context";
import * as days from "../../shared/dates";
import ColorPicker from "../ColorPicker";
import SelectDialog from "../SelectDialog";
import { Dialog, Transition } from "@headlessui/react";

export default function NewGuardia(props: {
  closeModal: Function;
  college: College;
  addGuardia: Function;
}) {
  const [selectedColor, setSelectedColor] = useState(
    Math.floor(Math.random() * 5)
  );

  const { collegeId } = router.query;

  const { user } = useContext(AuthContext);

  const [date, setDate] = useState(new Date());

  const [isOpen, setIsOpen] = useState(false);

  const [selectedClass, setSelectedClass] = useState(props.college.classes[0]);

  const hours = ["1", "2", "3", "4", "5", "6"];

  const [selectedHour, setSelectedHour] = useState(hours[0]);

  const colors = [
    "#7DD3FC",
    "#FDA4AF",
    "#6EE7B7",
    "#FDE68A",
    "#C4B5FD",
    "#CBD5E1",
  ];
  const saveGuardia = (e: React.SyntheticEvent) => {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      hour: { value: string };
      classroom: { value: string };
      tasks: { value: string };
      moreInfo: { value: string };
    };
    if (collegeId != undefined) {
      const guardia: Guardia = {
        dayOfGuardia: date,
        createdAt: new Date(),
        teacherId: user.uid,
        teacherName: user.displayName,
        collegeId: collegeId.toString(),
        updatedAt: null,
        tasks: target.tasks.value,
        moreInfo: target.moreInfo.value,
        classroom: selectedClass,
        hour: parseInt(selectedHour),
        color: selectedColor,
        isEmpty: false,
      };

      props.addGuardia(guardia);

      var newGuardia = addDocument("guardias", guardia).then((id) => {
        toast.success("Guardia guardado correctamente", {
          icon: "✅",
        });
        props.closeModal();
      });
      if (newGuardia == null) {
        toast("Error guardando la guardia", {
          icon: "⛔️",
        });
      }
    }
  };

  const changeColor = (number: number) => {
    setSelectedColor(number);
  };

  const handleClickOutside = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.stopPropagation();
    setIsOpen(false);
  };
  const childClick = (event: MouseEvent) => {
    event.stopPropagation();
    setIsOpen(true);
  };

  const generateKey = (pre: any) => {
    return `${pre}_${new Date().getTime()}`;
  };

  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          // Define default options
          duration: 5000,
          style: {
            background: "#363636",
            color: "#fff",
          },
        }}
      />
      <Transition appear show={true}>
        <Dialog
          onClick={(e:React.MouseEvent<HTMLDivElement, MouseEvent>) => handleClickOutside(e)}
          as="div"
          className="relative z-10"
          onClose={() => props.closeModal()}
        >
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
                    <p className="flex p-3 flex-row items-center text-slate-200 font-medium justify-center text-base ">
                      Día seleccionado: &nbsp;{" "}
                      <span className="font-light">
                        {date.getDate().toString()}/
                        {(date.getMonth() + 1).toString()}/
                        {date.getFullYear().toString()}-
                        {days.weekDaysLongES[date.getDay()]}
                      </span>
                    </p>

                    <button
                      className="ml-auto bg-transparent border-0 text-slate-700 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                      onClick={() => props.closeModal()}
                    >
                      <span className="bg-transparent hover:text-slate-700  text-slate-500 h-8 w-8 text-2xl block outline-none focus:outline-none">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-full w-full"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </span>
                    </button>
                  </div>
                  <Dialog.Title
                    as="h3"
                    className="text-lg p-3 font-medium leading-6 text-gray-900 flex flex-col justify-between"
                  >
                    <div className="mb-3 flex flex-row items-center justify-center w-full">
                      Color: &nbsp;
                      <ColorPicker
                        childClick={childClick}
                        isOpen={isOpen}
                        setSelectedColor={changeColor}
                        selectedColor={selectedColor}
                        colors={colors}
                      />
                    </div>
                    <form
                      className="h-full flex flex-col justify-between"
                      onSubmit={(e) => saveGuardia(e)}
                    >
                      <Calendar
                        onChange={setDate}
                        value={date}
                        minDate={new Date()}
                        className="rounded-2xl mb-3 self-center"
                      />

                      <div className="max-h-80 h-full flex flex-col justify-between">
                        <div className="flex sm:flex-row flex-col items-center justify-between mb-3">
                          <div className="w-48 h-16">
                            <label htmlFor="hour" className="text-sm">
                              Hora:
                            </label>
                            <SelectDialog
                              elements={hours}
                              hours={true}
                              selected={selectedHour}
                              setSelected={setSelectedHour}
                            />
                          </div>
                          <div className="w-48 h-16">
                            <label htmlFor="classroom" className="text-sm">
                              Clase
                            </label>
                            <SelectDialog
                              elements={props.college.classes}
                              hours={false}
                              selected={selectedClass}
                              setSelected={setSelectedClass}
                            />
                          </div>
                        </div>

                        <div className="mb-3  p-2 w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
                          <label htmlFor="tasks" className="text-sm my-3">
                            Tareas
                          </label>
                          <textarea
                            required
                            id="tasks"
                            className="resize-none outline-0 w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0 "
                            style={{ minHeight: "38px" }}
                          ></textarea>
                        </div>
                        <div className="mb-3  p-2 w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
                          <label htmlFor="moreInfo" className="text-sm my-3">
                            Información de Interés
                          </label>
                          <textarea
                            required
                            id="moreInfo"
                            className="resize-none outline-0 w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0 "
                            style={{ minHeight: "38px" }}
                          ></textarea>
                        </div>
                      </div>

                      {/*footer*/}
                      <div className="flex items-center justify-between rounded-b">
                        <button
                          className="hover:shadow-md hover:bg-red-200 rounded-lg text-red-500 background-transparent font-bold uppercase px-6 py-3 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                          type="button"
                          onClick={() => props.closeModal()}
                        >
                          Close
                        </button>

                        <button
                          disabled={date.getDay() === 6 || date.getDay() === 0}
                          className={
                            date.getDay() === 6 || date.getDay() === 0
                              ? "bg-slate-600  rounded-lg text-white  font-bold uppercase text-sm px-6 py-3 shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                              : "bg-[#09a290] rounded-lg text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                          }
                          type="submit"
                        >
                          {date.getDay() === 6 || date.getDay() === 0
                            ? "Selecciona un dia entre semana"
                            : "Guardar"}
                        </button>
                      </div>
                    </form>
                  </Dialog.Title>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
