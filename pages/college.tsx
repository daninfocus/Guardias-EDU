import React, {
  FormEvent,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import Image from 'next/image'
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/router";
import CollegeModel from "../@types/College";
import AuthContext from "../context/AuthContext";
import {
  getColleges,
  updateTeacherArray,
} from "../firebase/firestore";
import CreateCollegeForm from "../components/CreateCollegeForm";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Button from "@mui/material/Button";
import { FormHelperText } from "@mui/material";
import Stack from "@mui/material/Stack";
import SendIcon from "@mui/icons-material/Send";

const College = () => {
  const router = useRouter();

  const { user } = useContext(AuthContext);

  const [colleges, setColleges] = useState<Array<CollegeModel>>([]);

  const [selectedOption, setSelectedOption] = useState("");

  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const response = await getColleges();
      setColleges([...response]);
      return response;
    }
    fetchData();
  }, []);

  useEffect(() => {
    setHasError(false);
  }, [selectedOption]);

  async function addTeacherToCollege(collegeId: string) {
    if (collegeId != "") {
      setHasError(false);
      const college = await updateTeacherArray(collegeId, user);

      if (college != null) {
        toast.success("Te has registrado correctamente en " + college.name, {
          icon: "✅",
        });

        router.replace("/" + collegeId);
      } else {
        toast("Error fetching college", {
          icon: "⛔️",
        });
      }
    } else {
      setHasError(true);
    }
  }

  return (
    <>
      <Image src="/logo.jpg" width="100" height="83" ></Image>
      <div className="h-screen m-auto w-2/3 p-6">
        <div className="mt-44 h-1/4 flex flex-col items-center justify-evenly w-full">
          <title>Intitutos - Lista</title>
          <CreateCollegeForm/>
          
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 5000,
            }}
          />
        </div>
      </div>
    </>
  );
};

export default College;
