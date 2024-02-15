import { useContext } from "react";
import Guardia from "../@types/Guardia";
import CalendarContext from "../context/CalendarContext";
import { checkTargetForNewValues } from "framer-motion";

interface TimeSlot {
    hours: number;
    minutes: number;
    type: string;
    durationMinutes: number;
}

export function datesAreOnSameDay(first: Date, second: Date) {
    return first.getFullYear() === second.getFullYear() &&
        first.getMonth() === second.getMonth() &&
        first.getDate() === second.getDate();
}

export function generateKey(pre: any) {
    return `${pre}_${new Date().getTime()}`;
};

export const isGuardiaInCurrentWeek = (guardia: Guardia, currentWeek: Date[]) => {

    // Ensure the guardia has a valid date and the week array is not empty
    if (!guardia?.dayOfGuardia || !currentWeek?.length) return false;

    // Get the start and end dates of the week
    const weekStart = currentWeek[0];
    const weekEnd = currentWeek[currentWeek.length - 1];

    // Adjust the end date to the end of the day
    weekEnd.setHours(23, 59, 59, 999);

    // Check if the guardia's date falls within the week
    return guardia.dayOfGuardia >= weekStart && guardia.dayOfGuardia <= weekEnd;
};


function isSameDayOfWeek(date:Date, dayOfWeek:any) {
    return date.getDay() === dayOfWeek;
}

function isTimeAfterStart(date:Date, start:any) { 
    return date.getHours() > parseInt(start.hours) || 
           (date.getHours() === parseInt(start.hours) && date.getMinutes() >= parseInt(start.minutes));
}

function isTimeBeforeEnd(date:Date, end:any) {
    return date.getHours() < parseInt(end.hours) || 
           (date.getHours() === parseInt(end.hours) && date.getMinutes() <= parseInt(end.minutes));
}

function isWithinTimeSlot(date:Date, slot:any) {
    // console.log(slot)
    // console.log(isSameDayOfWeek(date, slot.dayOfWeek))
    // console.log(isTimeAfterStart(date, slot.start))
    // console.log(isTimeBeforeEnd(date, slot.end))
    return isSameDayOfWeek(date, slot.dayOfWeek) &&
           isTimeAfterStart(date, slot.start) &&
           isTimeBeforeEnd(date, slot.end);
}

export const isDateInSlot = (date: Date, slot: any, dayOfWeek: number) => {
    // Check if the day and hour match, and guardia time is within the slot duration
    return isWithinTimeSlot(date, { dayOfWeek, start: slot.start, end: slot.end });
}

export const getGuardiaCoords = (week: Date[], slots: any, date: Date) => {
    let x, y
    x = y = -1

    slots.forEach((slot: any, index: number) => {
        if (isDateInSlot(date, slot, date.getDay())) {
            console.log('y')
            y = index
        }
    });

    week.forEach((day, index) => {
        if (isSameDayOfWeek(date, day.getDay())){
            console.log('x')
            x = index
        }
    })
    
    return { x, y }
}

export const sortGuardias = (guardias: Guardia[], week: Date[], slots: any): Guardia[][][] => {
    // Assuming slots is an array of slot times, define the number of slots
    const numSlots = slots.length;

    // Initialize a 3D array with the size of week.length x numSlots
    let weekArray: Guardia[][][] = Array(numSlots)
        .fill(null)
        .map(() =>
            Array(week.length)
                .fill(null)
                .map(() => [] as Array<Guardia>)
        )

    // Iterate over each guardia
    guardias.forEach(guardia => {
        const { x, y } = getGuardiaCoords(week, slots, guardia.dayOfGuardia)
        console.log({ x, y })
        if (x > 0 && y > 0) {
            weekArray[x][y].push(guardia);
        }

    });

    return weekArray;
};