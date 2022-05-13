import React, {
  FormEvent,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { logOut } from "../firebase/auth";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/router";
import CollegeModel from "../models/College";
import AuthContext from "../store/auth.context";
import {
  addDocument,
  getColleges,
  updateTeacherArray,
} from "../firebase/firestore";
import firebase from "../firebase/firebase";
//ts-check
var i = 0;
const College = () => {
  i++;
  const router = useRouter();

  const [colleges, setColleges] = useState<Array<CollegeModel>>([]);
  const { user } = useContext(AuthContext);
  const [selectedOption, setSelectedOption] = useState("");

  useEffect(() => {}, [selectedOption]);
  let nameRef = useRef(null);

  useEffect(() => {
    async function fetchData() {
      // You can await here
      const response = await getColleges();
      setColleges([...response]);
      return response;
    }
    fetchData();
  }, []);

  async function addTeacherToCollege(
    event: FormEvent,
    collegeId: string,
    teacherId: string
  ) {
    event.preventDefault();
    const college = await updateTeacherArray(collegeId, teacherId);

    if (college != null) {

      toast.success("Te has registrado correctamente en " + college.name, {
        icon: "✅",
      });

      //@ts-ignore
      router.replace("/" + collegeId);
    } else {
      toast("Error fetching college", {
        icon: "⛔️",
      });
    }
  }

  function newCollege(event: FormEvent) {
    event.preventDefault();

    const college: CollegeModel = {
      //@ts-ignore
      name: nameRef?.current?.value,
      //@ts-ignore
      createdAt: new Date(),
      updatedAt: new Date(),
      uidAdmin: user.uid,
      teachers: [user.uid],
    };

    if (college.name.length >= 1) {
      addDocument("colleges", college).then((id) => {
        toast.success("College Added", {
          icon: "✅",
        });
        console.log(id);
        //@ts-ignore
        router.replace("/" + id);
      });
    } else {
      toast("An error occured in the form", {
        icon: "⛔️",
      });
    }
  }

  return (
    <div className="flex flex-col items-center justify-between bg-green h-screen p-32">
      <div className="inline-block relative w-64">
        <form
          onSubmit={(e) => addTeacherToCollege(e, selectedOption, user.uid)}
        >
          <select
            value={selectedOption}
            onChange={(e) => setSelectedOption(e.target.value)}
            className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
          >
            {colleges.map((item: any, index: number) => {
              return (
                <option value={item.id} key={index}>
                  {item.name}
                </option>
              );
            })}
            <option value="new-college">Quieres crearlo?</option>
          </select>
          {selectedOption != "new-college" && (
            <button
              type={"submit"}
              className="py-3 bg-black text-white rounded-md mb-4 w-1/2 "
            >
              Save
            </button>
          )}
        </form>

        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <svg
            className="fill-current h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
          </svg>
        </div>
      </div>
      {selectedOption == "new-college" && (
        <form
          className="flex flex-col w-full items-center sm:w-1/2 h-1/2"
          onSubmit={newCollege}
        >
          Introduce el nombre del Centro donde trabajas:
          <input
            className="border-2 rounded-lg w-1/2"
            ref={nameRef}
            placeholder="Ej: Santiago Santinguini IV"
            type="text"
          ></input>
          <button
            type={"submit"}
            className="py-3 bg-black text-white rounded-md mb-4 w-1/2 "
          >
            Save
          </button>
        </form>
      )}
      <Toaster
        position="top-center"
        toastOptions={{
          // Define default options
          duration: 5000,
        }}
      />
    </div>
  );
};

export default College;
