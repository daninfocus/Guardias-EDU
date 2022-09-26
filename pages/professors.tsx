import React, { useContext, useEffect, useState } from "react";
import Teacher from "../@types/Teacher";
import Nav from "../components/Nav";
import AuthContext from "../context/AuthContext";
import GuardiasContext from "../context/GuardiasContext";
import {
  deleteTeacherFromCollege,
  addAdmin,
  updateTeacherArray,
} from "../firebase/firestore";
import DropdownOptions from "../components/DropdownOptions";
import AuthCheck from "../components/auth/AuthCheck"
import { addListener } from "process";

const Professors = () => {
  const { user } = useContext(AuthContext);
  const { college } = useContext(GuardiasContext);
  const { isUserAdmin } = useContext(GuardiasContext);
  const { setCollege } = useContext(GuardiasContext);

  const [buttonEnable, setButtonEnabled] = useState(false);
  const [teachersInput, setTeachersInput] = useState("");

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
      await deleteTeacherFromCollege(college.id!, teacher);
      setCollege({ ...collegeAux });

      setButtonEnabled(true);
    }
  };

  const makeAdmin = async (teacher: Teacher) => {
    // college.admins.push(teacher.email!);
    await addAdmin(college.id!, teacher.email!);
    setCollege({ ...college });
  };

  const saveTeachers = () => {
    if(teachersInput.length > 5){
    
      var teachersToAdd:Array<string|undefined> = teachersInput.split(";");
      
      if (teachersToAdd.length > 1) {

        teachersToAdd = teachersToAdd.map((item:string|undefined) => {
          if(item){
            if(validateEmail(removeExtraSpace(item))) return removeExtraSpace(item)
          }
        });
        teachersToAdd.forEach(async (element:string|undefined) => {
            if(element){
              college.teachers!.push({ email: element } as Teacher);
              await updateTeacherArray(college.id!, element).then((item)=>console.log(item));
            }
        });
        setCollege({ ...college });

      }else{
        var teacherToAdd = removeExtraSpace(teachersToAdd[0]??'');
        if(validateEmail(teacherToAdd)){
          college.teachers!.push({ email: teacherToAdd } as Teacher);
          setCollege({ ...college });
          updateTeacherArray(college.id!, teacherToAdd);
        }
      }
      
    }else{
      alert('Debes introducir correos validos')
    }
  };

  function validateEmail(mail:string) 
  {
    var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    if (mail.match(validRegex)) {
      if(mail.includes("@fernando3martos.com")){
        return (true)
      }
    }
    alert('Debes introducir correos validos')
    return (false)
    
  }

  const onKeyUp = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.charCode === 13) {
      e.preventDefault();
      saveTeachers();
    }
  };

  const removeExtraSpace = (s: string) => s.trim().split(/ +/).join(" ");

  return (
    <AuthCheck>
      
      <title>{"Profesores"}</title>
      <div className="h-screen bg-gray-200 w-full">
        <Nav simpleNav={true} />
        <div className="mt-5 m-auto md:w-1/2 h-auto text-left rounded-xl shadow-2xl p-5 bg-gray-100">
          {college.teachers?.map((teacher, index) => {
            if (teacher) {
              // if (!teacher.status) {
              //   return (
              //     <div key={index}>
              //       <div className="flex flex-row justify-between text-xs items-start mb-5">
              //         {teacher.email}
              //       </div>
              //     </div>
              //   );
              // }
              // if (teacher.status == "Logged-in") {
                return (
                  <div key={index}>
                    <div className="flex flex-row justify-between text-xs items-start mb-5">
                      {teacher.email}
                      {!college.admins.includes(teacher.email!) ? (
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
                  </div>
                );
              // }
            }
          })}
          {isUserAdmin && 
          <div> 
            <input
              onKeyPress={(e) => onKeyUp(e)}
              type="textarea"
              value={teachersInput}
              onChange={(e) => setTeachersInput(e.target.value)}
              className="text-sm w-full h-full border-2 rounded-xl p-2"
            ></input>
            <div
              className="w-full justify-end flex p-2 items-center "
              onClick={() => saveTeachers()}
            >
              <div className="px-4 py-1 right-0 w-min items-center rounded-xl  hover:bg-emerald-600 hover:shadow-md transition-all cursor-pointer hover:translate-y-1 bg-emerald-500 text-white  font-semibold flex flex-row justify-between text-xs mb-5">
                <span className="whitespace-nowrap px-2">
                  Añadir profesor/es{" "}
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
          }
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
    </AuthCheck>
  );
};

export default Professors;
