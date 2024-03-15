import React, { useContext, useState } from "react";
import AuthContext from "../../context/AuthContext";
import { updateClassesForCollege } from "../../firebase/firestore";
import toast from "react-hot-toast";
import { TrashIcon } from "@heroicons/react/solid";
import { ChevronRightRounded } from "@mui/icons-material";

const AreasComponent = () => {
  
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
    saveClasses()
  };

  const deleteClass = (index: number) => {
    if (confirm("¿Quieres borrar esta clases?") && isUserAdmin()) {
      classes.splice(index, 1);
      setClasses([...classes]);
      setButtonEnabled(true);
      saveClasses();
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

  const removeExtraSpace = (s: string) => s.trim().split(/ +/).join(" ");

  return (
    <div className="bg-gray-200 rounded-lg p-5  w-full lg:m-0 lg:w-1/3 h-min m-auto">
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
          value={classInput}
          id="outlined-required"
          className="shadow-sm rounded-sm p-2 w-full mr-2.5 appearance-none text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-200"
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
    </div>
  );
};

export default AreasComponent;
