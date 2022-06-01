import { User } from "firebase/auth";
import React, { SyntheticEvent, useContext, useEffect, useState } from "react";
import Calendar from "react-calendar";
import { addDocument } from "../../firebase/firestore";
import College from "../../models/College";
import Guardia from "../../models/Guardia";
import toast from "react-hot-toast";
import router, { useRouter } from "next/router";
import AuthContext from "../../store/auth.context";
import * as days from "../../shared/dates";
import ColorPicker from "../ColorPicker";

export default function NewGuardia(props: {
  closeModal: Function;
  college: College;
  addGuardia: Function;
}) {
  const [selectedColor, setSelectedColor] = useState(Number);

  const { collegeId } = router.query;

  const { user } = useContext(AuthContext);

  const [date, setDate] = useState(new Date());
  const colors = [
    "#2196F3",
    "#009688",
    "#FFEB3B",
    "#4CAF50",
    "#f56565",
    "#ed64a6",
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
        classroom: target.classroom.value,
        hour: parseInt(target.hour.value),
        color: selectedColor,
        isEmpty: false
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

  const generateKey = (pre: any) => {
    return `${pre}_${new Date().getTime()}`;
  };

  const changeColor = (number: number) => {
    setSelectedColor(number);
  };
  return (
    <>
      <div className="sm:w-[600px] w-full  h-screen mx-auto overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        {/*content*/}
        <div className="border-0 rounded-lg shadow-lg relative h-full w-full bg-white outline-none focus:outline-none">
          <div className="relative px-5 pb-5 flex flex-col items-center justify-start h-full">
            <button
              className="ml-auto bg-transparent border-0 mt-3 text-slate-700 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
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
            <form
              className="h-full flex flex-col justify-between"
              onSubmit={(e) => saveGuardia(e)}
            >
              <Calendar
                onChange={setDate}
                value={date}
                minDate={new Date()}
                className="rounded-2xl "
              />
              <div className="flex flex-row items-center justify-between w-full">
                Color:
                <ColorPicker
                  setSelectedColor={changeColor}
                  selectedColor={selectedColor}
                  colors={colors}
                />
              </div>
              <div className="max-h-80 h-full flex flex-col justify-between">
                <div className="flex flex-row justify-between mb-3">
                  <div>
                    <label htmlFor="hour" className="text-sm">
                      Hora:
                    </label>
                    <select
                      id="hour"
                      className="border-2 rounded-md w-full"
                      required
                    >
                      <option value="1">1ª Primera</option>
                      <option value="2">2ª Segunda</option>
                      <option value="3">3ª Tercera</option>
                      <option value="4">4ª Cuarta</option>
                      <option value="5">5ª Quinta</option>
                      <option value="6">6ª Sexta</option>
                      <option value="All-day" className="font-bold">
                        Todo el dia
                      </option>
                    </select>
                  </div>
                  <div className=" overflow-hidden">
                    <label htmlFor="classroom" className="text-sm">
                      Clase
                    </label>
                    <select
                      id="classroom"
                      className="border-2 rounded-md w-full h-7"
                      required
                    >
                      {props.college.classes.map((value, index) => {
                        return (
                          <option
                            key={generateKey(index)}
                            value={value.toString()}
                          >
                            {value}
                          </option>
                        );
                      })}
                      <option value="special-day" className="font-bold">
                        Otro
                      </option>
                    </select>
                  </div>
                </div>
                <div>
                  <label htmlFor="tasks" className="text-sm  my-3">
                    Tareas
                  </label>
                  <textarea
                    required
                    id="tasks"
                    className="border-2 rounded-md w-full resize-none"
                    style={{ minHeight: "38px" }}
                  ></textarea>
                </div>
                <div>
                  <label htmlFor="moreInfo" className="text-sm my-3">
                    Información de Interés
                  </label>
                  <textarea
                    required
                    id="moreInfo"
                    className="border-2 rounded-md w-full resize-none"
                    style={{ minHeight: "38px" }}
                  ></textarea>
                </div>
              </div>
              <p className="flex p-3 flex-row items-center justify-center text-base font-light">
                Día seleccionado: {date.getDate().toString()}/
                {(date.getMonth() + 1).toString()}/
                {date.getFullYear().toString()}-
                {days.weekDaysLongES[date.getDay()]}
              </p>

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
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  );
}
