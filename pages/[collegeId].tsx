import { useRouter } from "next/router";
import React, { useEffect, useState, useRef } from "react";
import { getCollegeDataById } from "../firebase/firestore";
import MainCalendar from "../components/calendar/MainCalendar";
import Nav from "../components/Nav";
import AuthCheck from "../components/AuthCheck";
import CollegeModel from "../models/College";
import NewGuardia from "../components/guardias/NewGuardia";
import GuardiaModel from "../models/Guardia";
import { getGuardias } from "../firebase/firestore";

const newCollege = new CollegeModel();
const Home = () => {
  const COLS = 6;

  const ROWS = 6;

  const router = useRouter();

  const { collegeId } = router.query;

  const [college, setCollege] = useState<CollegeModel>(newCollege);

  const [showNewGuardia, setShowNewGuardia] = useState(false);

  const [guardias, setGuardias] = useState<Array<Array<Array<GuardiaModel>>>>(
    Array(ROWS)
      .fill(null)
      .map(() =>
        Array(COLS - 1)
          .fill(null)
          .map(() => [{ id: "empty" }] as Array<GuardiaModel>)
      )
  );

  const addGuardia = (guardia: GuardiaModel) => {
    if (
      guardias[guardia.hour - 1][guardia.dayOfGuardia.getDay() - 1][0].id ==
      "empty"
    ) {
      guardias[guardia.hour - 1][guardia.dayOfGuardia.getDay() - 1][0] =
        guardia;
    } else {
      guardias[guardia.hour - 1][guardia.dayOfGuardia.getDay() - 1].push(
        guardia
      );
    }

    setGuardias([...guardias]);
  };

  const getAndSetGuardias = async () => {
    var guardiaResponse = await getGuardias();

    var sortedArrayOfGuardiasResponse: Array<Array<Array<GuardiaModel>>> =
      Array(ROWS)
        .fill(null)
        .map(() =>
          Array(COLS - 1)
            .fill(null)
            .map(() => [{ id: "empty" }] as Array<GuardiaModel>)
        );
    guardiaResponse.forEach((element) => {
      if (
        sortedArrayOfGuardiasResponse[element.hour - 1][
          element.dayOfGuardia.getDay() - 1
        ][0].id == "empty"
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
    setGuardias(sortedArrayOfGuardiasResponse);
  };

  useEffect(() => {
    getAndSetGuardias();
  }, []);

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
    <AuthCheck >
      <div className="h-screen flex flex-col overflow-y-hidden overflow-x-hidden">
        <title>{"Guardias - " + college.name}</title>
        <Nav college={college} />

        <button
          className="m-auto w-40 py-2 px-6 bg-orange-500 hover:bg-orange-600 text-sm text-white font-bold rounded-xl transition duration-200"
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
        <MainCalendar guardias={guardias} />
      </div>
    </AuthCheck>
  );
};

export default Home;
