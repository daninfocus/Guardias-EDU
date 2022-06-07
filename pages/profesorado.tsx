import React, { useContext, useState } from "react";
import Teacher from "../@types/Teacher";
import Nav from "../components/Nav";
import AuthContext from "../context/AuthContext";
import GuardiasContext from "../context/GuardiasContext";
import { updateTeacherArray } from "../firebase/firestore";
const Profesorado = () => {
  const { user } = useContext(AuthContext);
  const { college } = useContext(GuardiasContext);
  const { isUserAdmin } = useContext(GuardiasContext);
  const { setCollege } = useContext(GuardiasContext);

  const [buttonEnable, setButtonEnabled] = useState(false);

  const deleteTeacher = (teacher: Teacher) => {
    const collegeAux = college;
    collegeAux.teachers = collegeAux.teachers!.splice(
      college.teachers!.indexOf(teacher),
      1
    );
    setCollege({ ...collegeAux });
    console.log(college.teachers);
  };

  return (
    <div className="h-screen bg-gray-200">
      <Nav simpleNav={true} />
      <div className="mt-5 m-auto w-1/2 h-auto text-left rounded-xl shadow-2xl p-5 bg-gray-100">
        {college.teachers?.map((teacher, index) => {
          console.log(teacher.id!);

          return (
            <h1 key={index}>
              <p className="flex flex-row justify-between items-start mb-5">
                {teacher.email}
                {teacher.id! != college.uidAdmin ? (
                  isUserAdmin ? (
                    <button
                      className="rounded-xl bg-red-400 px-4 text-sm font-medium"
                      onClick={() => deleteTeacher(teacher)}
                    >
                      {" "}
                      Borrar
                    </button>
                  ) : (
                    <></>
                  )
                ) : (
                  <div className="rounded-xl bg-blue-400 px-4 text-sm font-medium">
                    {" "}
                    Admin
                  </div>
                )}
              </p>
            </h1>
          );
        })}
        <hr></hr>
        <div className="text-center w-full ">
          {isUserAdmin ? (
            <button
              disabled={!buttonEnable}
              className={
                !buttonEnable
                  ? "px-7 py-2 mt-5 bg-gray-600 text-slate-800 font-bold rounded-xl"
                  : "px-7 py-2 mt-5 bg-emerald-600 text-white font-bold rounded-xl"
              }
            >
              Save
            </button>
          ) : (
            <> </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profesorado;
