import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { getCollegeDataById,getGuardias } from "../firebase/firestore";
import MainCalendar from "../components/calendar/MainCalendar";
import Nav from "../components/Nav";
import AuthCheck from "../components/auth/AuthCheck";
import CollegeModel from "../models/College";
import NewGuardia from "../components/guardias/NewGuardia";
import GuardiaModel from "../models/Guardia";

const Home = () => {
  const newCollege = new CollegeModel();

  const COLS = 6;

  const ROWS = 6;

  const TODAY = new Date();

  const router = useRouter();

  const { collegeId } = router.query;

  const [college, setCollege] = useState<CollegeModel>(newCollege);

  const [showNewGuardia, setShowNewGuardia] = useState(false);

  const [week, setWeek] = useState<Array<Date>>([
    TODAY,
    TODAY,
    TODAY,
    TODAY,
    TODAY,
  ]);

  const [guardias, setGuardias] = useState<Array<Array<Array<GuardiaModel>>>>(
    Array(ROWS)
      .fill(null)
      .map(() =>
        Array(COLS - 1)
          .fill(null)
          .map(() => [{ isEmpty: true }] as Array<GuardiaModel>)
      )
  );

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
    getAndSetGuardias();
  }, [collegeId, week]);

  useEffect(() => {
    async function fetchData() {
      if (collegeId != undefined) {
        const response = await getCollegeDataById(collegeId.toString());
        if (response != undefined) {
          setCollege(response as CollegeModel);
        }
        return response;
      }
    }
    fetchData();
  }, [collegeId]);

  return (
    <AuthCheck>
      <div className="h-screen flex flex-col overflow-y-hidden overflow-x-hidden">
        <title>{"Guardias - " + college.name}</title>
        <Nav college={college} showNewGuardia={() => setShowNewGuardia(true)} />

        <button
          className="hidden md:visible m-auto w-40 py-2 px-6 bg-orange-500 hover:bg-orange-600 text-sm text-white font-bold rounded-xl transition duration-200"
          type="button"
          onClick={() => setShowNewGuardia(true)}
        >
          Registrar Falta
        </button>
        {showNewGuardia ? (
          <NewGuardia
            college={college}
            closeModal={() => setShowNewGuardia(false)}
            addGuardia={addGuardia}
          />
        ) : null}
        <MainCalendar
          guardias={guardias}
          COLS={COLS}
          ROWS={ROWS}
          TODAY={TODAY}
          week={week}
          setWeek={setWeek}
          isGuardiaInCurrentWeek={isGuardiaInCurrentWeek}
        />
      </div>
    </AuthCheck>
  );
};

export default Home;
