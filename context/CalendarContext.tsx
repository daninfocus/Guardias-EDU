import React, { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import useCalendar from "./CalendarContext";
import { getCollegeDataById } from "../firebase/firestore";
import College from "../@types/College";
import Guardia from "../@types/Guardia";
import { isDateInSlot } from "../logic/functions";
import AuthContext from "./AuthContext";

interface CalendarContextType {
  currentWeek: Date[];
  goToNextWeek: Function;
  goToPreviousWeek: Function;
  getGuardiasInSlot: Function;
  firstDayOfWeek: Number;
  showWeekends: Boolean;
  hoursInDay: Number;
  schedule: ScheduleType;
}

export interface TimeSlotType {
  start: {
    hours: any;
    minutes: any;
  };
  end: {
    hours: any;
    minutes: any;
  };
  label: string;
  durationMinutes: any;
}

export type ScheduleType = TimeSlotType[]


export const scheduleStructure : TimeSlotType = {
  start: {
    hours: "",
    minutes: "",
  },
  end: {
    hours: "",
    minutes: "",
  },
  label: "",
  durationMinutes: "",
}

const defaultSchedule = [
    {
      start: {
        hours: 8,
        minutes: 15,
      },
      end: {
        hours: 9,
        minutes: 15,
      },
      label: "🏫",
      durationMinutes: 60,
    },
    {
      start: {
        hours: 9,
        minutes: 15,
      },
      end: {
        hours: 10,
        minutes: 15,
      },
      label: "🏫",
      durationMinutes: 60,
    },
    {
      start: {
        hours: 10,
        minutes: 15,
      },
      end: {
        hours: 10,
        minutes: 30,
      },
      label: "🥪",
      durationMinutes: 15,
    },
    {
      start: {
        hours: 10,
        minutes: 30,
      },
      end: {
        hours: 11,
        minutes: 30,
      },
      label: "🏫",
      durationMinutes: 60,
    },
    {
      start: {
        hours: 11,
        minutes: 30,
      },
      end: {
        hours: 12,
        minutes: 30,
      },
      label: "🏫",
      durationMinutes: 60,
    },
    {
      start: {
        hours: 12,
        minutes: 30,
      },
      end: {
        hours: 12,
        minutes: 45,
      },
      label: "🥪",
      durationMinutes: 15,
    },
    {
      start: {
        hours: 12,
        minutes: 45,
      },
      end: {
        hours: 13,
        minutes: 45,
      },
      label: "🏫",
      durationMinutes: 60,
    },
    {
      start: {
        hours: 13,
        minutes: 45,
      },
      end: {
        hours: 14,
        minutes: 45,
      },
      label: "🏫",
      durationMinutes: 60,
    },
  ]

const CalendarContext = createContext<CalendarContextType>({
  currentWeek: [], // Provide a default value
  goToNextWeek: Function,
  goToPreviousWeek: Function,
  getGuardiasInSlot: Function,
  firstDayOfWeek: 1,
  showWeekends: false,
  hoursInDay: 6,
  schedule: defaultSchedule,
});

// Utility function to get dates for the week given a reference date

//TODO: week start day dynamic, + 1 = starting day monday
const getWeekDates = (
  referenceDate: Date,
  firstDayOfWeek: number = 1,
  showWeekends: boolean = false
) => {
  const weekStart = new Date(referenceDate);

  weekStart.setDate(weekStart.getDate() - weekStart.getDay() + firstDayOfWeek);

  const array = Array.from({ length: showWeekends ? 7 : 5 }, (_, index) => {
    const day = new Date(weekStart);
    day.setDate(day.getDate() + index);
    return day;
  });

  return array;
};

// Calendar Provider
export const CalendarContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {

  const {college} = useContext(AuthContext)

  const [firstDayOfWeek, setFirstDayOfWeek] = useState(1);
  const [showWeekends, setShowWeekends] = useState(false);
  const [hoursInDay, setHoursInDay] = useState(6);
  const [schedule, setSchedule] = useState<ScheduleType>(college.schedule);
  const [currentWeek, setCurrentWeek] = useState(
    getWeekDates(new Date(), firstDayOfWeek, showWeekends)
  );

  const goToNextWeek = () => {
    const nextWeekStart = new Date(currentWeek[0]);
    nextWeekStart.setDate(nextWeekStart.getDate() + 7);
    setCurrentWeek(getWeekDates(nextWeekStart));
  };

  const goToPreviousWeek = () => {
    const prevWeekStart = new Date(currentWeek[0]);
    prevWeekStart.setDate(prevWeekStart.getDate() - 7);
    setCurrentWeek(getWeekDates(prevWeekStart));
  };

  const getGuardiasInSlot = (day: number, slot: any) => {
    const guardias = JSON.parse(
      localStorage.getItem("guardias") ?? "[]"
    ) as Array<Guardia>;

    const guardiasArray = guardias.filter((item: Guardia) => {
      const dayOfGuardia = new Date(item.dayOfGuardia);
      console.log(dayOfGuardia, slot, day)
      if(isDateInSlot(dayOfGuardia, slot, day)){
        console.log(item)
        return item
      }
    });
    return guardiasArray
  };

  useEffect(() => {
    setSchedule(college.schedule)
  }, [college])
  

  // Provide context values
  return (
    <CalendarContext.Provider
      value={{
        currentWeek,
        goToNextWeek,
        goToPreviousWeek,
        getGuardiasInSlot,
        firstDayOfWeek,
        showWeekends,
        hoursInDay,
        schedule,
      }}
    >
      {children}
    </CalendarContext.Provider>
  );
};

export default CalendarContext;
