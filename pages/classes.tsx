import React, { useContext, useEffect, useRef, useState } from "react";
import Nav from "../components/Nav";
import GuardiasContext from "../context/GuardiasContext";
import CollegeModel from "../@types/College";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/router";
import AuthContext from "../context/AuthContext";
import { FormHelperText } from "@mui/material";
import { updateClassesForCollege } from "../firebase/firestore";
import Box from "@mui/material/Box";
import { TextField } from "@mui/material";
import Button from "@mui/material/Button";
import SendIcon from "@mui/icons-material/Send";
import Stack from "@mui/material/Stack";
import DeleteIcon from "@mui/icons-material/Delete";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import { IconButton } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import AuthCheck from "../components/auth/AuthCheck";

const Classes = () => {
  //context
  const { isUserAdmin } = useContext(GuardiasContext);
  const { college } = useContext(GuardiasContext);

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
    if (confirm("¿Quieres borrar esta clases?") && isUserAdmin) {
      classes.splice(index, 1);
      setClasses([...classes]);
      setButtonEnabled(true);
    }
  };

  const onKeyUp = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.charCode === 13) {
      e.preventDefault();
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

  const fieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (college != undefined) {
      setClasses(college.classes);
    }
  }, [college]);

  useEffect(() => {
    fieldRef.current!.scrollIntoView();
  }, [classInput]);

  const removeExtraSpace = (s: string) => s.trim().split(/ +/).join(" ");

  return (
    <AuthCheck>
      <div>
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
        <div className="static w-full max-h-screen rounded-xl">
          <Box
            component="form"
            sx={{
              minWidth: 220,
            }}
            noValidate
            autoComplete="off"
          >
            <hr className="mt-3" />
            <List
              sx={{
                width: "100%",
                minWidth: 220,
                bgcolor: "background.paper",
                marginBottom: "15px",
              }}
              className={
                classes.length == 0
                  ? "h-auto "
                  : "mt-5 h-80 w-full overflow-scroll overflow-x-hidden scroll-auto"
              }
            >
              {classes.map((value, index) => {
                return (
                  <ListItem
                    key={index}
                    secondaryAction={
                      <IconButton
                        size="large"
                        onClick={() => deleteClass(index)}
                      >
                        <DeleteIcon color="error" />
                      </IconButton>
                    }
                  >
                    <div className="break-all">{value}</div>
                    <ListItemIcon></ListItemIcon>
                  </ListItem>
                );
              })}
              <div
                style={{ float: "left", clear: "both" }}
                ref={fieldRef}
              ></div>
            </List>

            <hr className="mb-3" />
            {classes.length == 0 ? (
              <></>
            ) : (
              <h2 className="w-full flex flex-row justify-end p-2">
                Classes: {classes.length}
              </h2>
            )}

            <Stack
              direction="row"
              className="flex flex-row justify-center items-center p-2 m-auto"
            >
              <TextField
                placeholder="1º ESO"
                value={classInput}
                onChange={(e) => setClassInput(e.target.value)}
                id="outlined-required"
                label="Añade a la lista una clase"
                onKeyPress={(e) => onKeyUp(e)}
                className="w-1/2"
              />
              <IconButton
                size="small"
                className="h-8 w-8 ml-3"
                onClick={() => addClass()}
              >
                <AddCircleIcon />
              </IconButton>
            </Stack>
            <Stack
              direction="row"
              spacing={2}
              className="flex flex-row items-center justify-center mt-4"
            >
              <Button
                disabled={!buttonEnable}
                variant="outlined"
                color="success"
                endIcon={<SendIcon />}
                onClick={() => saveClasses()}
              >
                Guardar Lista
              </Button>
            </Stack>
          </Box>
        </div>
      </div>
    </AuthCheck>
  );
};

export default Classes;
