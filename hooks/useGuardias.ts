import { useState, useEffect } from 'react';
import { getGuardias, updateGuardia, deleteGuardia } from '../firebase/firestore';
import Guardia from "../@types/Guardia";
import useCalendar from "../context/CalendarContext"

function useGuardias(collegeId:string | string[] | undefined) {
  const COLS = 6;
  const ROWS = 6;

  // const currentWeek = JSON.parse(localStorage.getItem("currentWeek") ?? "[]")

  const [guardias, setGuardias] = useState<Array<Guardia>>([]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!collegeId) return;
    setLoading(true);

    // Fetch guardias from Firebase
    // getGuardias(currentWeek, collegeId).then((data) => {
    //   console.log({data})
    //   setGuardias(data);
    //   setLoading(false);
    // });

  }, [collegeId]);

  const addOrUpdateGuardia = async (guardia: Guardia) => {
    const updated = await updateGuardia(guardia);
    // Update state with new/updated guardia
    // ...
  };

  const removeGuardia = async (guardia: Guardia) => {
    await deleteGuardia(guardia);
    // Update state to remove deleted guardia
    // ...
  };

  return { guardias, loading, addOrUpdateGuardia, removeGuardia };
}

export default useGuardias;