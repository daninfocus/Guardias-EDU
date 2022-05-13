import React, { useState } from "react";
import Calendar from "react-calendar";

interface dataFormProps {
  closeModal: () => void;
}
export default function NewGuardia({ closeModal = () => {} }: dataFormProps) {
  const [value, onChange] = useState(new Date());

  return (
    <>
      <div className="sm:w-[600px] w-full sm:h-auto h-screen sm:my-6 mx-auto overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        {/*content*/}
        <div className="border-0 rounded-lg shadow-lg relative flex flex-col justify-between sm:h-auto h-full w-full bg-white outline-none focus:outline-none">
          {/*header*/}
          <div className="flex items-start justify-between pr-5 pt-5 rounded-t">
            {/* <h3 className="text-3xl font-semibold">
                    Regis
                  </h3> */}
            <button
              className="ml-auto bg-transparent border-0 text-slate-700 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
              onClick={() => closeModal()}
            >
              <span className="bg-transparent text-slate-700 h-8 w-8 text-2xl block outline-none focus:outline-none">
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
          {/*body*/}
          <div className="relative px-5 flex flex-col items-center justify-center w-full ">
            <form className="p-5">
              <p className="flex flex-row items-center justify-center text-lg ">
                {value.getDate().toString()}/{(value.getMonth() + 1).toString()}
                /{value.getFullYear().toString()}
              </p>
              <Calendar
                onChange={onChange}
                value={value}
                minDate={new Date()}
                className="m-auto rounded-2xl"
              />

              <div className="flex flex-row justify-between">
                <div>
                  <label htmlFor="hour" className="text-sm">
                    Hora:
                  </label>
                  <input
                    id="hour"
                    className="border-2 rounded-md w-full"
                  ></input>
                </div>
                <div>
                  <label htmlFor="class" className="text-sm">
                    Clase
                  </label>
                  <input
                    id="class"
                    className="border-2 rounded-md w-full"
                  ></input>
                </div>
              </div>
              <label htmlFor="tasks" className="text-sm">
                Tareas
              </label>
              <textarea
                id="tasks"
                className="border-2 rounded-md w-full resize-none"
              ></textarea>
              <label htmlFor="more_info" className="text-sm">
                Informacion de Interes
              </label>
              <input
                id="more_info"
                className="border-2 rounded-md w-full"
              ></input>
            </form>
          </div>
          {/*footer*/}
          <div className="flex items-center justify-between p-2 border-t border-solid border-slate-200 rounded-b">
            <button
              className="hover:shadow-md hover:bg-red-200 rounded-lg text-red-500 background-transparent font-bold uppercase px-6 py-3 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
              type="button"
              onClick={() => closeModal()}
            >
              Close
            </button>
            <button
              className="bg-[#09a290] rounded-lg text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
              type="button"
              onClick={() => closeModal()}
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  );
}
