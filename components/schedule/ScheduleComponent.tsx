import React, { ChangeEvent, useContext, useEffect, useState } from "react";
import CalendarContext, {
  ScheduleType,
  TimeSlotType,
  scheduleStructure,
} from "../../context/CalendarContext";
import { updateTimeSlotsForCollege } from "../../firebase/firestore";
import { ChevronRightRounded } from "@mui/icons-material";
import AuthContext from "../../context/AuthContext";
import toast from "react-hot-toast";
import { start } from "repl";
import { ArrowUpIcon, TrashIcon } from "@heroicons/react/solid";
import TimeInput from "../TimeInput";

const ScheduleComponent = () => {
  const { schedule } = useContext(CalendarContext);
  const { college, user, isUserAdmin } = useContext(AuthContext);

  const [newSchedule, setNewSchedule] =
    useState<TimeSlotType>(scheduleStructure);
  const [scheduleState, setSchedule] = useState<ScheduleType>(schedule);

  const saveTimeSlots = () => {
    updateTimeSlotsForCollege(college.id!, scheduleState).then((data) => {
      if (data) {
        toast.success("Horario guardado correctamente", {
          icon: "✅",
        });
      } else {
        toast.success("Hubo un problema guardando el horario", {
          icon: "❌",
        });
      }
    });
  };

  useEffect(() => {
    if (newSchedule !== scheduleStructure) {
      saveTimeSlots();
      setNewSchedule(scheduleStructure);
    }
  }, [scheduleState]);

  const save = () => {
    const startMinutes =
      newSchedule.start.hours * 60 + newSchedule.start.minutes;
    const endMinutes = newSchedule.end.hours * 60 + newSchedule.end.minutes;

    const durationMinutes = endMinutes - startMinutes;

    // Update the durationMinutes property in the newSchedule object
    newSchedule.durationMinutes = durationMinutes;

    setSchedule([...scheduleState, newSchedule]);
  };

  const deleteTimeSlot = (index: number) => {
    if (confirm("¿Quieres borrar este horario?") && isUserAdmin()) {
      scheduleState.splice(index, 1);

      setSchedule([...scheduleState]);
    }
  };

  const shiftSlotUp = (index: number) => {
    if (index > 0) {
      var element = schedule[index];
      schedule.splice(index, 1);
      schedule.splice(index - 1, 0, element);

      setSchedule([...schedule]);
    }
  };

  const checkLabel = (event: ChangeEvent<HTMLInputElement>) => {
    if (
      event.target.value.match(
        /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/g
      ) ||
      event.target.value.length == 0
    ) {
      setNewSchedule({ ...newSchedule, label: event.target.value });
    }
  };

  return (
    <div className="bg-gray-200 rounded-lg p-5  w-full lg:m-0 lg:w-1/3 h-min m-auto">
      <div className="bg-white rounded-lg p-4 text-gray-700">
        {scheduleState.map((slot: any, index) => {
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
        <span className="flex flex-row items-center relative">
          <input
            onChange={(e) => checkLabel(e)}
            value={newSchedule.label}
            className="bg-gray-200 shadow-sm rounded-sm p-2 w-8  appearance-none text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            placeholder="x"
          />
          :
          <TimeInput
            setNewSchedule={setNewSchedule}
            newSchedule={newSchedule}
            lastTimeSlot={scheduleState[scheduleState.length - 1]}
            endSlot={false}
          />
          &nbsp; -
          <TimeInput
            setNewSchedule={setNewSchedule}
            newSchedule={newSchedule}
            lastTimeSlot={scheduleState[scheduleState.length - 1]}
            endSlot={true}
          />
          <span
            className="place-self-stretch h-full right-0 absolute bg-white rounded-lg flex items-center justify-center  focus:outline-none focus:shadow-outline shadow cursor-pointer"
            onClick={() => save()}
          >
            <ChevronRightRounded />
          </span>
        </span>
      </div>
    </div>
  );
};

export default ScheduleComponent;
