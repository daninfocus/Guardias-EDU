import { useRouter } from "next/router";
import React, { createContext, useContext, useEffect, useState } from "react";
import {
  deleteGuardia,
  editGuardia,
  getCollegeDataById,
  getGuardias,
} from "../firebase/firestore";
import GuardiaModel from "../@types/Guardia";
import CollegeModel from "../@types/College";
import AuthContext from "./AuthContext";
import toast from "react-hot-toast";

interface GuardiasContextInterface {
  guardias: Array<Array<Array<GuardiaModel>>>;
  college: CollegeModel;
  setGuardiaToEdit: Function;
  addGuardia: Function;
  guardiaToEdit: GuardiaModel;
  COLS: 6;
  ROWS: 6;
  TODAY: Date;
  week: Array<Date>;
  isGuardiaInCurrentWeek: Function;
  showNewGuardia: Boolean;
  setShowNewGuardia: Function;
  editSelectedGuardia: Function;
  deleteSelectedGuardia: Function;
  decrementWeek: Function;
  incrementWeek: Function;
  saveEditedGuardia: Function;
  setPressedNewGuardia: Function;
  pressedNewGuardia: Boolean;
  isUserAdmin: Boolean;
}
const GuardiasContext = createContext({} as GuardiasContextInterface);

export function GuardiasContextProvider({ children }: any) {
  const COLS = 6;
  const ROWS = 6;
  const TODAY = new Date();
  const newCollege = new CollegeModel();
  const router = useRouter();

  //context
  const { user } = useContext(AuthContext);
  var collegeId = router.query.collegeId;

  useEffect(() => {
    if (router.asPath.indexOf("collegeid") != -1) {
      collegeId=router.asPath.substring(router.asPath.indexOf("collegeid") + 10);
    }
  }, [collegeId]);

  //state
  const [isUserAdmin, setIsUserAdmin] = useState(false);
  const [college, setCollege] = useState<CollegeModel>(newCollege);
  const [guardias, setGuardias] = useState<Array<Array<Array<GuardiaModel>>>>(
    Array(ROWS)
      .fill(null)
      .map(() =>
        Array(COLS - 1)
          .fill(null)
          .map(() => [{ isEmpty: true }] as Array<GuardiaModel>)
      )
  );
  const [week, setWeek] = useState<Array<Date>>([
    TODAY,
    TODAY,
    TODAY,
    TODAY,
    TODAY,
  ]);
  const [day, setDay] = useState<Date>(TODAY);
  const [weekPos, setWeekPos] = useState<number>(0);
  const [guardiaToEdit, setGuardiaToEdit] = useState({} as GuardiaModel);
  const [pressedNewGuardia, setPressedNewGuardia] = useState(false);
  const [showNewGuardia, setShowNewGuardia] = useState(false);

  //functions
  const createWeek = (daysInWeek = COLS - 1) => {
    let week = [];
    var nextWeekDate = new Date(TODAY.getTime());
    var today =
      weekPos != 0
        ? new Date(nextWeekDate.setDate(day.getDate() + weekPos * 7))
        : new Date(TODAY.getTime());
    for (let i = 1; i < daysInWeek + 1; i++) {
      const dayNum = today.getDate() - today.getDay() + i;
      const date = new Date(today.setDate(dayNum));
      week.push(date);
    }
    setWeek([...week]);
  };

  const incrementWeek = () => {
    setWeekPos(weekPos + 1);
  };

  const decrementWeek = () => {
    setWeekPos(weekPos - 1);
  };

  const isGuardiaInCurrentWeek = (guardia: GuardiaModel) => {
    if (!guardia.isEmpty) {
      //if year is with-in the week
      if (
        guardia.dayOfGuardia.getFullYear() == week[0].getFullYear() ||
        guardia.dayOfGuardia.getFullYear() ==
          week[week.length - 1].getFullYear()
      ) {
        //if the month is with-in the week
        if (
          guardia.dayOfGuardia.getMonth() == week[0].getMonth() ||
          guardia.dayOfGuardia.getMonth() == week[week.length - 1].getMonth()
        ) {
          //if date in month is with-in the week
          var isInWeek = false;
          for (let i = 0; i < COLS - 1; i++) {
            if (guardia.dayOfGuardia.getDate() == week[i].getDate()) {
              isInWeek = true;
            }
          }
          return isInWeek;
        }
      }
    }
    return false;
  };

  const deleteSelectedGuardia = async (guardia: GuardiaModel) => {
    if (
      user &&
      user.uid == guardia.teacherId &&
      confirm("¿Quieres borrar esta guardia?")
    ) {
      deleteGuardia(guardia).then(() => getAndSetGuardias());
    }
  };

  const editSelectedGuardia = async (guardia: GuardiaModel) => {
    setShowNewGuardia(true);
    setGuardiaToEdit(guardia);
  };

  const saveEditedGuardia = async (guardia: GuardiaModel) => {
    await editGuardia(guardia).then((data) => {
      toast.success("Guardia guardado correctamente", {
        icon: "✅",
      });
    });
  };

  const addGuardia = (guardia: GuardiaModel) => {
    if (isGuardiaInCurrentWeek(guardia)) {
      if (
        guardias[guardia.hour - 1][guardia.dayOfGuardia.getDay() - 1][0].isEmpty
      ) {
        guardias[guardia.hour - 1][guardia.dayOfGuardia.getDay() - 1][0] =
          guardia;
      } else {
        guardias[guardia.hour - 1][guardia.dayOfGuardia.getDay() - 1].push(
          guardia
        );
      }
      setGuardias([...guardias]);
    }
  };

  const getAndSetGuardias = async () => {
    if (collegeId != null) {
      var guardiaResponse = await getGuardias(collegeId.toString());
      var sortedArrayOfGuardiasResponse: Array<Array<Array<GuardiaModel>>> =
        Array(ROWS)
          .fill(null)
          .map(() =>
            Array(COLS - 1)
              .fill(null)
              .map(() => [{ isEmpty: true }] as Array<GuardiaModel>)
          );

      guardiaResponse.forEach((element) => {
        if (isGuardiaInCurrentWeek(element)) {
          if (
            sortedArrayOfGuardiasResponse[element.hour - 1][
              element.dayOfGuardia.getDay() - 1
            ][0].isEmpty
          ) {
            sortedArrayOfGuardiasResponse[element.hour - 1][
              element.dayOfGuardia.getDay() - 1
            ][0] = element;
          } else {
            sortedArrayOfGuardiasResponse[element.hour - 1][
              element.dayOfGuardia.getDay() - 1
            ].push(element);
          }
        }
      });
      setGuardias([...sortedArrayOfGuardiasResponse]);
    }
  };

  useEffect(() => {
    if (user && college.uidAdmin == user.uid) {
      setIsUserAdmin(true);
    }
  }, [college, user]);

  useEffect(() => {
    createWeek();
  }, [weekPos]);

  useEffect(() => {
    getAndSetGuardias();
  }, [collegeId, week]);

  useEffect(() => {
    async function fetchData() {
      if (collegeId != undefined) {
        const response = await getCollegeDataById(collegeId.toString());
        if (response != undefined) {
          var college = response as CollegeModel;
          college.id = collegeId.toString();
          setCollege(college);
        }
        return response;
      }
    }
    fetchData();
  }, [collegeId]);

  return (
    <GuardiasContext.Provider
      value={{
        guardias,
        college,
        setGuardiaToEdit,
        addGuardia,
        guardiaToEdit,
        COLS: 6,
        ROWS: 6,
        TODAY: new Date(),
        week,
        isGuardiaInCurrentWeek,
        showNewGuardia,
        setShowNewGuardia,
        editSelectedGuardia,
        deleteSelectedGuardia,
        decrementWeek,
        incrementWeek,
        saveEditedGuardia,
        setPressedNewGuardia,
        pressedNewGuardia,
        isUserAdmin,
      }}
    >
      {children}
    </GuardiasContext.Provider>
  );
}

export default GuardiasContext;
