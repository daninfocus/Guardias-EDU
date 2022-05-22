import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Calendar from "react-calendar";



export default function NewGuardia(props:{ closeModal:Function,classes:Array<String> }) {
  

  const [date, setDate] = useState(new Date());

  const [tasks, setTasks] = useState("");

  const [moreInfo, setMoreInfo] = useState("");


  

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
              onClick={() => props.closeModal()}
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
                {date.getDate().toString()}/{(date.getMonth() + 1).toString()}/
                {date.getFullYear().toString()}
              </p>
              <Calendar
                onChange={setDate}
                value={date}
                minDate={new Date()}
                className="m-auto rounded-2xl"
              />

              <div className="flex flex-row justify-between">
                <div>
                  <label htmlFor="hour" className="text-sm">
                    Hora:
                  </label>
                  <select id="hour" className="border-2 rounded-md w-full">
                    <option value="first">1ª Primera</option>
                    <option value="second">2ª Segunda</option>
                    <option value="third">3ª Tercera</option>
                    <option value="fourth">4ª Cuarta</option>
                    <option value="fifth">5ª Quinta</option>
                    <option value="sixth">6ª Sexta</option>
                    <option value="sixth">
                      <p className="font-extrabold">Todo el dia</p>
                    </option>
                  </select>
                </div>
                <div className=" overflow-hidden">
                  <label htmlFor="class" className="text-sm">
                    Clase
                  </label>
                  <select id="class" className="border-2 rounded-md w-full h-7">
                    {
                      props.classes.map((value,index)=>{
                        return(<option key={index} value={value.toString()}>{value}</option>);
                      })
                    }
                    <option value="all-day">
                      <p className="font-extrabold">Todo el dia</p>
                    </option>
                  </select>
                </div>
              </div>
              <label htmlFor="tasks" className="text-sm">
                Tareas
              </label>
              <textarea
                value={tasks}
                onChange={(e) => setTasks(e.target.value)}
                id="tasks"
                className="border-2 rounded-md w-full resize-none"
              ></textarea>
              <label htmlFor="more_info" className="text-sm">
                Información de Interés
              </label>
              <input
                id="more_info"
                value={moreInfo}
                onChange={(e) => setMoreInfo(e.target.value)}
                className="border-2 rounded-md w-full"
              ></input>
            </form>
          </div>
          {/*footer*/}
          <div className="flex items-center justify-between p-2 border-t border-solid border-slate-200 rounded-b">
            <button
              className="hover:shadow-md hover:bg-red-200 rounded-lg text-red-500 background-transparent font-bold uppercase px-6 py-3 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
              type="button"
              onClick={() => props.closeModal()}
            >
              Close
            </button>
            <button
              className="bg-[#09a290] rounded-lg text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
              type="button"
              onClick={() => props.closeModal()}
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
