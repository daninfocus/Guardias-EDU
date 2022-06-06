import React, {
  FormEvent,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
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
      const college = await updateTeacherArray(collegeId, user.uid);

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
      <svg
        className="h-10 m-2"
        role="img"
        aria-labelledby="logo"
        viewBox="0 0 100 100"
      >
        <path d="M100 34.2c-.4-2.6-3.3-4-5.3-5.3-3.6-2.4-7.1-4.7-10.7-7.1-8.5-5.7-17.1-11.4-25.6-17.1-2-1.3-4-2.7-6-4-1.4-1-3.3-1-4.8 0-5.7 3.8-11.5 7.7-17.2 11.5L5.2 29C3 30.4.1 31.8 0 34.8c-.1 3.3 0 6.7 0 10v16c0 2.9-.6 6.3 2.1 8.1 6.4 4.4 12.9 8.6 19.4 12.9 8 5.3 16 10.7 24 16 2.2 1.5 4.4 3.1 7.1 1.3 2.3-1.5 4.5-3 6.8-4.5 8.9-5.9 17.8-11.9 26.7-17.8l9.9-6.6c.6-.4 1.3-.8 1.9-1.3 1.4-1 2-2.4 2-4.1V37.3c.1-1.1.2-2.1.1-3.1 0-.1 0 .2 0 0zM54.3 12.3L88 34.8 73 44.9 54.3 32.4V12.3zm-8.6 0v20L27.1 44.8 12 34.8l33.7-22.5zM8.6 42.8L19.3 50 8.6 57.2V42.8zm37.1 44.9L12 65.2l15-10.1 18.6 12.5v20.1zM50 60.2L34.8 50 50 39.8 65.2 50 50 60.2zm4.3 27.5v-20l18.6-12.5 15 10.1-33.6 22.4zm37.1-30.5L80.7 50l10.8-7.2-.1 14.4z"></path>
      </svg>
      <div className="h-screen m-auto w-2/3 p-6">
        <div className="mt-44 h-1/4 flex flex-col items-center justify-evenly w-full">
          <title>Intitutos - Lista</title>
          <h2 className="m-auto mb-4">Selecciona tu instituto:</h2>
          <Box sx={{ minWidth: 220 }} className=" flex flex-col items-center w-full">
            <FormControl fullWidth className="m-4" error={hasError} >
              <InputLabel id="demo-simple-select-label">Instituto</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={selectedOption}
                label="Instituto"
                required
                onChange={(e) => setSelectedOption(e.target.value)}
                className="w-full"
              >
                {colleges.map((item: any, index: number) => {
                  return (
                    <MenuItem value={item.id} key={index}>
                      {item.name}
                    </MenuItem>
                  );
                })}
                <MenuItem value="new-college" className=" font-bold">
                  Quieres crearlo?*
                </MenuItem>
              </Select>
              {hasError && (
                <FormHelperText className="text-red-500">
                  Selecciona una opcion
                </FormHelperText>
              )}
            </FormControl>
            {selectedOption.toString() != "new-college" ? (
              <Stack direction="row" spacing={2} className="m-4">
                <Button
                  variant="outlined"
                  color="success"
                  endIcon={<SendIcon />}
                  onClick={() => addTeacherToCollege(selectedOption)}
                >
                  Send
                </Button>
              </Stack>
            ) : (
              <></>
            )}
            <CreateCollegeForm selectedOption={selectedOption.toString()} />
          </Box>
          
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
