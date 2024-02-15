import React, { useContext, useEffect, useState } from "react";
import CalendarContext from "../context/CalendarContext";
import { updateTimeSlotsForCollege } from "../firebase/firestore";
import { ChevronRightRounded } from "@mui/icons-material";
import AuthContext from "../context/AuthContext";
import toast from "react-hot-toast";
import { start } from "repl";
import { ArrowUpIcon, TrashIcon } from "@heroicons/react/solid";

const TimeSlotInput = () => {
  const { schedule } = useContext(CalendarContext);
  const { college, user, isUserAdmin } = useContext(AuthContext);

  const [scheduleLabel, setScheduleLabel] = useState("");
  const [scheduleHour, setScheduleHour] = useState<string>();
  const [scheduleMinutes, setScheduleMinutes] = useState<string>();
  const [timeFrame, setTimeFrame] = useState<any>();
  const [scheduleState, setSchedule] = useState<Array<Object>>(schedule);

  const addTimeSlot = (timeslot: any) => {
    let aux = schedule;
    aux.push(timeslot);
    setSchedule([...schedule]);
  };

  const saveTimeSlots = () => {
    updateTimeSlotsForCollege(college.id!, schedule).then((data) => {
      toast.success("Horario guardado correctamente", {
        icon: "✅",
      });
    });
  };

  const next = () => {
    if (timeFrame) {
      let obj = {
        ...timeFrame,
        end: {
          hours: scheduleHour,
          minutes: scheduleMinutes,
        },
        label: scheduleLabel,
      };

      addTimeSlot(obj);
    } else {
      const obj = {
        start: {
          hours: scheduleHour,
          minutes: scheduleMinutes,
        },
      };
      setTimeFrame(obj);
    }
  };

  const deleteTimeSlot = (index: number) => {
    if (confirm("¿Quieres borrar este horario?") && isUserAdmin()) {
      schedule.splice(index, 1);
      setSchedule([ ...schedule ]);
    }
  };

  const shiftSlotUp = (index: number) => {
    if (index > 0) {
      var element = schedule[index];
      schedule.splice(index, 1);
      schedule.splice(index - 1, 0, element);

      setSchedule([ ...schedule ]);
    }
  };

  return (
    <div className="bg-gray-200 rounded-lg p-5  w-full lg:m-0 lg:w-56 m-auto">
      <div className="bg-white rounded-lg p-4 text-gray-700">
        {scheduleState.map((slot:any, index) => {
          return (
            <div
              key={index}
              className="flex flex-row items-center justify-between"
            >
              <div className="break-all">
                {slot.label} : {slot.start.hours + ":" + slot.start.minutes}-
                {slot.end.hours + ":" + slot.end.minutes}
              </div>
              {isUserAdmin() && (
                <div className="flex flex-row justify-between">
                  <TrashIcon
                    onClick={() => deleteTimeSlot(index)}
                    height={15}
                    className="text-red-500 cursor-pointer"
                  />
                  <ArrowUpIcon
                    onClick={() => shiftSlotUp(index)}
                    height={15}
                    className="text-slate-500 cursor-pointer"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className="my-4 flex flex-col">
        <input
          onChange={(e) => setScheduleLabel(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          type="text"
          placeholder="Label"
        />
        {timeFrame ? "Fin" : "Inicio"}:
        <span className="flex flex-row">
          <input
            onChange={(e) => setScheduleHour(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="number"
            placeholder="8"
          />

          <input
            onChange={(e) => setScheduleMinutes(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="number"
            placeholder="15"
          />
          <span
            className="bg-white rounded-lg flex items-center justify-center  focus:outline-none focus:shadow-outline shadow cursor-pointer"
            onClick={() => next()}
          >
            <ChevronRightRounded />
          </span>
        </span>
      </div>
      <span
        className={` cursor-pointer ${
          schedule !== scheduleState ? "underline font-medium" : "font-normal"
        }`}
        onClick={() => saveTimeSlots()}
      >
        {" "}
        Guardar{" "}
      </span>
    </div>
  );
};

export default TimeSlotInput;
