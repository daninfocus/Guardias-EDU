import React, { SetStateAction } from "react";
import { TimeSlotType } from "../context/CalendarContext";

interface TimeInputProps {
  setNewSchedule: React.Dispatch<React.SetStateAction<TimeSlotType>>;
  newSchedule: TimeSlotType;
  lastTimeSlot: TimeSlotType;
  endSlot: boolean;
}

const TimeInput: React.FC<TimeInputProps> = ({
  setNewSchedule,
  newSchedule,
  lastTimeSlot,
  endSlot = false,
}) => {


  return (
    <span className="flex flex-row items-center">
      <input      
        onChange={(e) =>
          endSlot
            ? setNewSchedule({
                ...newSchedule,
                end: {
                  minutes: newSchedule.end.minutes,
                  hours: e.target.value,
                },
              })
            : setNewSchedule({
                ...newSchedule,
                start: {
                  minutes: newSchedule.start.minutes,
                  hours: e.target.value,
                },
              })
        }
        value={
            endSlot
            ? newSchedule.end.hours
            : newSchedule.start.hours
        }
        className="shadow-sm rounded-sm p-2 w-8 appearance-none text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-200 text-end"
        type="number"
        placeholder={
          endSlot
            ? (parseInt(lastTimeSlot.end.hours) + 1).toString()
            : (parseInt(lastTimeSlot.end.hours)).toString()
        }
        max={23}
        min={0}
      />
      :
      <input
        onChange={(e) =>
          endSlot
            ? setNewSchedule({
                ...newSchedule,
                end: {
                  hours: newSchedule.end.hours,
                  minutes: e.target.value,
                },
              })
            : setNewSchedule({
                ...newSchedule,
                start: {
                  hours: newSchedule.start.hours,
                  minutes: e.target.value,
                },
              })
        }
        value={
            endSlot
            ? newSchedule.end.minutes
            : newSchedule.start.minutes
        }
        className="shadow-sm rounded-sm p-2 w-8 appearance-none text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-200"
        type="number"
        placeholder={lastTimeSlot.end.minutes}
        max={59}
        min={0}
      />
    </span>
  );
};

export default TimeInput;
