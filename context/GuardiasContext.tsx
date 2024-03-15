import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/router";
import useGuardias from "../hooks/useGuardias";
import {
  addDocument,
  deleteGuardia,
  getCollegeDataById,
  getGuardias,
  updateGuardia,
} from "../firebase/firestore";
import College from "../@types/College";
import Guardia from "../@types/Guardia";
import CalendarContext from "./CalendarContext";
import toast from "react-hot-toast";
import FormContext from "./FormContext";
import { sortGuardias } from "../logic/functions";

interface GuardiasContextType {
  guardias: Array<Array<Array<Guardia>>>;
  addOrUpdateGuardia: Function;
  removeGuardia: Function;
  saveGuardia: Function;
}

const GuardiasContext = createContext<GuardiasContextType>({
  guardias: [], // Provide a default value
  addOrUpdateGuardia: Function,
  removeGuardia: Function,
  saveGuardia: Function,
});

// Guardias Provider
export const GuardiasContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { currentWeek, schedule } = useContext(CalendarContext);

  const { isFormOpen, openForm, closeForm } = useContext(FormContext);
  const router = useRouter();
  const collegeId = router.query.collegeId;

  const [guardias, setGuardias] = useState<Guardia[][][]>(
    Array(schedule.length)
      .fill(null)
      .map(() =>
        Array(currentWeek.length)
          .fill(null)
          .map(() => [] as Array<Guardia>)
      )
  );

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchGuardias();
  }, [collegeId, currentWeek, schedule]);

  const fetchGuardias = () => {
    if (!collegeId || !schedule) return;

    // Fetch guardias from Firebase
    getGuardias(currentWeek, collegeId).then((data) => {
      const guardiasSortedIntoWeek = sortGuardias(data, currentWeek, schedule);
      localStorage.setItem("guardias", JSON.stringify(guardiasSortedIntoWeek));
      setGuardias(guardiasSortedIntoWeek);
      setLoading(false);
    });
  };

  const saveGuardia = (guardia: Guardia) => {
    var newGuardia = addDocument("guardias", guardia).then((id) => {
      toast.success("Guardia guardado correctamente", {
        icon: "✅",
      });
      fetchGuardias();
      closeForm();
    });
    if (newGuardia == null) {
      toast("Error guardando la guardia", {
        icon: "⛔️",
      });
    }
  };

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

  // Provide context values
  return (
    <GuardiasContext.Provider
      value={{ guardias, addOrUpdateGuardia, removeGuardia, saveGuardia }}
    >
      {children}
    </GuardiasContext.Provider>
  );
};

export default GuardiasContext;
