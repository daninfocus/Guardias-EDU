import { useRouter } from "next/router";
import React, { createContext, useContext, useEffect, useState } from "react";
import {
  deleteGuardia,
  editGuardia,
  getCollegeDataById,
  firestore,
  getTeacherById,
  addDocument,
} from "../firebase/firestore";
import GuardiaModel from "../@types/Guardia";
import CollegeModel from "../@types/College";
import AuthContext from "./AuthContext";
import toast from "react-hot-toast";
import {
  collection,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";

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
  showGuardiaForm: Boolean;
  setShowGuardiaForm: Function;
  openGuardiaToEdit: Function;
  deleteSelectedGuardia: Function;
  loadingGuardias: Boolean;
  decrementWeek: Function;
  incrementWeek: Function;
  saveEditedGuardia: Function;
  setPressedNewGuardia: Function;
  pressedNewGuardia: Boolean;
  isUserAdmin: Boolean;
  setCollege: Function;
  saveGuardia: Function;
  setCollegeId: Function;
}
const GuardiasContext = createContext({} as GuardiasContextInterface);

export function GuardiasContextProvider({ children }: any) {
  const COLS = 6;
  const ROWS = 6;
  const TODAY = new Date();
  TODAY.setHours(0,0,0,0);
  const newCollege = new CollegeModel();
  const router = useRouter();

  //context
  const { user } = useContext(AuthContext);
  

  //state
  const [isUserAdmin, setIsUserAdmin] = useState(false);
  const [collegeId, setCollegeId] = useState(router.query.collegeId);
  
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
  const [week, setWeek] = useState<Array<Date>>([TODAY,TODAY,TODAY,TODAY,TODAY,]);
  const [weekPos, setWeekPos] = useState<number>(0);
  const [guardiaToEdit, setGuardiaToEdit] = useState({} as GuardiaModel);
  const [pressedNewGuardia, setPressedNewGuardia] = useState(false);
  const [showGuardiaForm, setShowGuardiaForm] = useState(false);
  const [loadingGuardias, setLoadingGuardias] = useState(false);

  //functions
  const createWeek = (daysInWeek = COLS - 1) => {
    let week = [];
    var nextWeekDate = new Date(TODAY);
    var today =
      weekPos != 0
        ? new Date(nextWeekDate.setDate(TODAY.getDate() + weekPos * 7))
        : new Date(TODAY);
    for (let i = 1; i < daysInWeek + 1; i++) {
      if(i==daysInWeek){
        today.setHours(21,59,59,999)
      }
      const dayNum = today.getDate() - today.getDay() + i;
      const date = new Date(today.setDate(dayNum));
      week.push(date);
    }
    
    setWeek([...week]);
    getGuardiasReponse([...week]);
  };

  const incrementWeek = () => {
    setWeekPos(weekPos + 1);
  };

  const decrementWeek = () => {
    setWeekPos(weekPos - 1);
  };

  const isGuardiaInCurrentWeek = (guardia: GuardiaModel,week:Array<Date>) => {
    
    if (!guardia.isEmpty && week) {
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
      (user.uid == guardia.teacher!.id || isUserAdmin) &&
      confirm("¿Quieres borrar esta guardia?")
    ) {
      deleteGuardia(guardia).then(() => {
        toast.success("Guardia borrado correctamente", {
          icon: "✅",
        });
      });
    }
  };

  const openGuardiaToEdit = async (guardia: GuardiaModel) => {
    setShowGuardiaForm(true);
    setGuardiaToEdit(guardia);
  };

  const saveEditedGuardia = async (guardia: GuardiaModel) => {
    await editGuardia(guardia).then((data) => {
      toast.success("Guardia guardado correctamente", {
        icon: "✅",
      });
      setShowGuardiaForm(false);
    });
  };

  const saveGuardia = (guardia: GuardiaModel) => {
    var newGuardia = addDocument("guardias", guardia).then((id) => {
      toast.success("Guardia guardado correctamente", {
        icon: "✅",
      });
      setShowGuardiaForm(false);
    });
    if (newGuardia == null) {
      toast("Error guardando la guardia", {
        icon: "⛔️",
      });
    }
  };

  const addGuardia = (guardia: GuardiaModel) => {

    //this is to update the state and show the new guardia on screen
    if (isGuardiaInCurrentWeek(guardia,week)) {
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

  //this gathers the guardia response from local storage and puts them into the week array in there correct position
  const getAndSetGuardias = async (week:Array<Date>) => {
    
    if (collegeId != null) {
      
      var sortedArrayOfGuardiasResponse: Array<Array<Array<GuardiaModel>>> =
        Array(ROWS)
          .fill(null)
          .map(() =>
            Array(COLS - 1)
              .fill(null)
              .map(() => [{ isEmpty: true }] as Array<GuardiaModel>)
          );

      var localStorageGuardiaResponse = localStorage.getItem("guardiaResponse");
      
      if (localStorageGuardiaResponse != null) {
        const guardiaResponse = JSON.parse(
          localStorageGuardiaResponse
        ) as Array<GuardiaModel>;

        guardiaResponse.forEach((element) => {
          element.dayOfGuardia = new Date(element.dayOfGuardia);

          if (isGuardiaInCurrentWeek(element, week)) {
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
        
        setLoadingGuardias(false);
        setGuardias([...sortedArrayOfGuardiasResponse]);
      }
    }
  };

  //gets guardia response snapshot and adds the response to the local storage, 
  const getGuardiasReponse = async (week:Array<Date>) => {
    
    if (collegeId != undefined && !loadingGuardias) {
      setLoadingGuardias(true);
      
      var firstday = new Date(week[0]);
      
      var lastday =  new Date(week[4]);


      const q = query(
        collection(firestore, "guardias"),
        where("collegeId", "==", collegeId),
        where("dayOfGuardia", ">=", firstday),
        where("dayOfGuardia", "<=", lastday)
      );
      //snapshot for realtime updates
      const unsubscribe = onSnapshot(q, async (querySnapshot) => {
        const guardiaArray: Array<GuardiaModel> = [];
        for(const doc of querySnapshot.docs) {
          var guardia = doc.data();
          var guardiaDate = guardia.dayOfGuardia.toDate();
          // guardia.teacher = await getTeacherById(guardia.teacherDocId);
          delete guardia.teacherId;
          delete guardia.teacherName;
          guardia.id = doc.id;
          guardia.dayOfGuardia = guardiaDate;
          guardiaArray.push(guardia as GuardiaModel);
        }
        localStorage.setItem(
          "guardiaResponse",
          JSON.stringify(guardiaArray)
        );
        getAndSetGuardias(week);
      });
    }
  };

  useEffect(() => {
    if (user != null && college.admins.includes(user.email)) {
      setIsUserAdmin(true);
    } else {
      setIsUserAdmin(false);
    }
  }, [college, user]);

  //when the collegeid is recieved we wuery the db for the guardias
  useEffect(() => {

    const getData = async()=>{
      setLoadingGuardias(true);
      await getAndSetGuardias(week);
      

      //COMMENT THIS AND GUARDIAS LOAD ON CALENDAR INSTANTLY, LEAVE IT AND TAKES HOWEVER LONG THE QUERY TAKES??????
      getGuardiasReponse(week);
    }
    
    if(collegeId!=undefined && user){
      getData();
    }

  }, [collegeId]);

  //creates a new week if user clicked next week or previous week
  useEffect(() => {
    createWeek();
  }, [weekPos]);

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

  useEffect(() => {
    setCollegeId(router.query.collegeId);
  }, [router.query.collegeId])
  

  return (
    <GuardiasContext.Provider
      value={{
        loadingGuardias,
        saveGuardia,
        setCollege,
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
        showGuardiaForm,
        setShowGuardiaForm,
        openGuardiaToEdit,
        deleteSelectedGuardia,
        decrementWeek,
        incrementWeek,
        saveEditedGuardia,
        setPressedNewGuardia,
        pressedNewGuardia,
        isUserAdmin,
        setCollegeId
      }}
    >
      {children}
    </GuardiasContext.Provider>
  );
}

export default GuardiasContext;
