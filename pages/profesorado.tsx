import React, { useContext, useState } from "react";
import Teacher from "../@types/Teacher";
import Nav from "../components/Nav";
import AuthContext from "../context/AuthContext";
import GuardiasContext from "../context/GuardiasContext";
import { deleteTeacherFromCollege,addAdmin } from "../firebase/firestore";
import DropdownOptions from "../components/DropdownOptions";

const Profesorado = () => {
  const { user } = useContext(AuthContext);
  const { college } = useContext(GuardiasContext);
  const { isUserAdmin } = useContext(GuardiasContext);
  const { setCollege } = useContext(GuardiasContext);

  const [buttonEnable, setButtonEnabled] = useState(false);

  const deleteTeacher = async (teacher: Teacher) => {
    if (
      confirm(
        "¿Quieres borrar a " +
          teacher.name +
          " con correo: " +
          teacher.email +
          " ?"
      )
    ) {
      const collegeAux = college;
      collegeAux.teachers!.splice(college.teachers!.indexOf(teacher), 1);
      await deleteTeacherFromCollege(college.id!, teacher.id!);
      setCollege({ ...collegeAux });

      setButtonEnabled(true);
    }
  };

  const makeAdmin = async (teacher: Teacher) => {
   college.uidAdmins.push(teacher.id!);
   await addAdmin(college.id!,teacher.id!);
   setCollege({ ...college })
  };

  return (
    <div className="h-screen bg-gray-200 w-full">
      <Nav simpleNav={true} />
      <div className="mt-5 m-auto md:w-1/2 h-auto text-left rounded-xl shadow-2xl p-5 bg-gray-100">
        {college.teachers?.map((teacher, index) => {
          return (
            <h1 key={index}>
              <div className="flex flex-row justify-between text-xs items-start mb-5">
                {teacher.email}
                {!college.uidAdmins.includes(teacher.id!) ? (
                  isUserAdmin ? (
                    <div>
                      <DropdownOptions
                        simple={true}
                        labelFirstButton="Admin"
                        labelSecondButton="Borrar"
                        funcFirstButton={() => makeAdmin(teacher)}
                        funcSecondButton={() => {
                          deleteTeacher(teacher);
                        }}
                      />
                    </div>
                  ) : (
                    <></>
                  )
                ) : (
                  <div className="rounded-xl bg-blue-400 px-4 text-sm font-medium">
                    {" "}
                    Admin
                  </div>
                )}
              </div>
            </h1>
          );
        })}
        <hr></hr>
        <div className="text-center w-full ">
          {/* {isUserAdmin ? (
            <button
            onClick={()=>{saveTeachersChanges()}}
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
          )} */}
        </div>
      </div>
    </div>
  );
};

export default Profesorado;
