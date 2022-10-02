import { useRouter } from "next/router";
import React, { createContext, useContext, useEffect, useState } from "react";
import {
  firestore,
  getTeacherById,
  teacherRef
} from "../firebase/firestore";
import GuardiaModel from "../@types/Guardia";
import CollegeModel from "../@types/College";
import AuthContext from "./AuthContext";
import { addDoc, Timestamp, collection, doc, getDoc, getDocs, deleteDoc, getFirestore, limit, orderBy, query, queryEqual, arrayUnion, startAfter, startAt, updateDoc, where, arrayRemove, onSnapshot } from 'firebase/firestore';

interface GuardiasNoLoginContextInterface {
  guardias: Array<Array<Array<GuardiaModel>>>;
  college: CollegeModel;
  COLS: 6;
  ROWS: 6;
  TODAY: Date;
  week: Array<Date>;
  loadingGuardias: Boolean;
  setCollege: Function;
  setCollegeId: Function;
  
}
const GuardiasNoLoginContext = createContext({} as GuardiasNoLoginContextInterface);

export function GuardiasNoLoginContextProvider({ children }: any) {
  const COLS = 6;
  const ROWS = 6;
  const TODAY = new Date();
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

  const createWeek = (daysInWeek = COLS - 1) => {
    let week = [];
    var nextWeekDate = new Date(TODAY.getTime());
    var today =
      weekPos != 0
        ? new Date(nextWeekDate.setDate(TODAY.getDate() + weekPos * 7))
        : new Date(TODAY.getTime());
    for (let i = 1; i < daysInWeek + 1; i++) {
      const dayNum = today.getDate() - today.getDay() + i;
      const date = new Date(today.setDate(dayNum));
      week.push(date);
    }
    setWeek([...week]);
  };

  //this gathers the guardia response from local storage and puts them into the week array in there correct position
  const getAndSetGuardias = async () => {
    
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
        });
        setLoadingGuardias(false);
        setGuardias([...sortedArrayOfGuardiasResponse]);
      }
    }
  };

  //gets guardia response snapshot and adds the response to the local storage, 
  const getGuardiasReponse = async () => {
    if (collegeId != undefined && !loadingGuardias) {
      setLoadingGuardias(true);

      var firstday = new Date(week[0].setUTCHours(-2,0,0,0));

      var lastday =  new Date(week[4].setUTCHours(21,59,59,999));


      console.log({firstday})
      console.log({lastday})


      const q = query(
        collection(firestore, "guardias"),
        where("collegeId", "==", collegeId),
        where("dayOfGuardia", ">=", firstday),
        where("dayOfGuardia", "<=", lastday)
      );
      //snapshot for realtime updates
      const unsubscribe = onSnapshot(q, async (querySnapshot) => {
        console.log(querySnapshot)
        const guardiaArray: Array<GuardiaModel> = [];
        for(const doc of querySnapshot.docs) {
          var guardia = doc.data();
          var guardiaDate = guardia.dayOfGuardia.toDate();
          guardia.teacher = await getTeacherById(guardia.teacherDocId);
          guardia.teacher.id = guardia.teacherId;
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
        getAndSetGuardias();
      });
    }
  };

  //when the collegeid is recieved we wuery the db for the guardias
  useEffect(() => {
    createWeek();
    // const updateGuardiasField = async()=>{
    //   const docs = await getDocs(collection(firestore, "guardias"));
    //   docs.forEach(async (doc)=>{
    //     let ref = await teacherRef(doc.data().teacherEmail)
    //     await updateDoc(doc.ref,{teacherDocId:ref.docs[0].id})
    //   })
    // }
    // updateGuardiasField()


    if(collegeId!=undefined){ 
      setLoadingGuardias(true);
      
      var localStorageGuardiaResponse = localStorage.getItem("guardiaResponse");
      if(localStorageGuardiaResponse){
        getAndSetGuardias();
      }
      getGuardiasReponse();
    }

  }, [collegeId]);


  return (
    <GuardiasNoLoginContext.Provider
      value={{
        loadingGuardias,
        setCollege,
        guardias,
        college,
        COLS: 6,
        ROWS: 6,
        TODAY: new Date(),
        week,
        setCollegeId
      }}
    >
      {children}
    </GuardiasNoLoginContext.Provider>
  );
}

export default GuardiasNoLoginContext;
