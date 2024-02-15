import React, { useContext, useEffect, useRef, useState } from "react";
import Nav from "../components/Nav";
import GuardiasContext from "../context/GuardiasContext";
import CollegeModel from "../@types/College";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/router";
import AuthContext from "../context/AuthContext";
import {
  updateClassesForCollege,
  updateTimeSlotsForCollege,
} from "../firebase/firestore";
import AuthCheck from "../components/auth/AuthCheck";
import CalendarContext from "../context/CalendarContext";
import { ChevronRightRounded } from "@mui/icons-material";
import { TrashIcon } from "@heroicons/react/solid";
import TimeSlotInput from "../components/TimeSlotInput";

const Schedule = () => {
  //context

  const { college, user, isUserAdmin } = useContext(AuthContext);

  //state
  const [classInput, setClassInput] = useState("");
  const [classes, setClasses] = useState<Array<string>>(college.classes);
  const [buttonEnable, setButtonEnabled] = useState(false);

  const addClass = () => {
    setButtonEnabled(true);
    var classSanitized = removeExtraSpace(classInput);
    setClasses([...classes, classSanitized]);
    setClassInput("");
  };

  const deleteClass = (index: number) => {
    if (confirm("¿Quieres borrar esta clases?") && isUserAdmin()) {
      classes.splice(index, 1);
      setClasses([...classes]);
      setButtonEnabled(true);
    }
  };

  const handleKeyDown = (event: any) => {
    if (event.keyCode === 13) {
      addClass();
    }
  };

  const saveClasses = async () => {
    updateClassesForCollege(college.id!, classes).then((data) => {
      toast.success("Classes guardado correctamente", {
        icon: "✅",
      });
    });
  };

  // useEffect(() => {
  //   if (college != undefined) {
  //     setClasses(college.classes);
  //   }
  // }, [college]);

  const removeExtraSpace = (s: string) => s.trim().split(/ +/).join(" ");

  return (
    <AuthCheck>
      <title>Schedule</title>

      <Toaster
        position="bottom-center"
        toastOptions={{
          // Define default options
          duration: 5000,
          style: {
            background: "#363636",
            color: "#fff",
          },
        }}
      />
      <Nav simpleNav={true} />
      <div className="flex flex-row gap-7">
        <TimeSlotInput />

        <div className="bg-gray-200 rounded-lg p-5  w-full lg:m-0 lg:w-56 m-auto">
          <div className="bg-white rounded-lg p-4 text-gray-700">
            {classes.map((value: string, index: number) => {
              return (
                <div
                  key={index}
                  className="flex flex-row items-center justify-between"
                >
                  <div className="break-all">{value}</div>
                  {isUserAdmin() && (
                    <TrashIcon
                      onClick={() => deleteClass(index)}
                      height={15}
                      className="text-red-500 cursor-pointer"
                    />
                  )}
                </div>
              );
            })}
          </div>

          <div className="my-4 flex flex-row">
            <input
              onChange={(e) => setClassInput(e.target.value)}
              id="outlined-required"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              placeholder="Add timeslot here"
              onKeyDown={handleKeyDown}
            />
            <span
              className="bg-white rounded-lg flex items-center justify-center  focus:outline-none focus:shadow-outline shadow cursor-pointer"
              onClick={() => addClass()}
            >
              <ChevronRightRounded />
            </span>
          </div>
          <span
            className={` cursor-pointer ${
              classes !== college.classes
                ? "underline font-medium"
                : "font-normal"
            }`}
            onClick={() => saveClasses()}
          >
            {" "}
            Guardar{" "}
          </span>
        </div>

        {/* <IconButton
          size="small"
          className="h-8 w-8 ml-3"
          onClick={() => addClass()}
        >
          <AddCircleIcon />
        </IconButton> */}
      </div>
    </AuthCheck>
  );
};

export default Schedule;
