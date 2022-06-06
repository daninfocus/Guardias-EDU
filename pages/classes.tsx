import React, { useContext, useEffect, useState } from "react";
import Nav from "../components/Nav";
import GuardiasContext from "../context/GuardiasContext";
import CollegeModel from "../@types/College";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import AuthContext from "../context/AuthContext";
import { FormHelperText } from "@mui/material";
import { addDocument } from "../firebase/firestore";
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
  const [hasErrorClasses, setHasErrorClasses] = useState(false);
  const [classInput, setClassInput] = useState("");
  const [classes, setClasses] = useState<Array<string>>(college.classes);

  const addClass = () => {
    var classSanitized = removeExtraSpace(classInput);
    setClasses([...classes, classSanitized]);
    setClassInput("");
  };

  const deleteClass = (index: number) => {
    if (confirm("¿Quieres borrar esta clases?")) {
      classes.splice(index, 1);
      setClasses([...classes]);
    }
  };

  const onKeyUp = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.charCode === 13) {
      e.preventDefault();
      addClass();
    }
  };

  useEffect(() => {
    setClasses(college.classes);
  }, [college]);

  const removeExtraSpace = (s: string) => s.trim().split(/ +/).join(" ");

  return (
    <div>
      <Nav simpleNav={true} />
      <div className="static w-full max-h-screen">
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
                ? "h-auto"
                : "h-72 overflow-scroll overflow-x-hidden"
            }
          >
            {classes.map((value, index) => {
              return (
                <ListItem
                  key={index}
                  secondaryAction={
                    <IconButton size="large" onClick={() => deleteClass(index)}>
                      <DeleteIcon color="error" />
                    </IconButton>
                  }
                >
                  <div className="break-all">{value}</div>
                  <ListItemIcon></ListItemIcon>
                </ListItem>
              );
            })}
          </List>

          <hr className="mb-3" />
          {classes.length == 0 ? (
            <></>
          ) : (
            <h2 className="w-full flex flex-row justify-end p-2">
              Classes: {classes.length}
            </h2>
          )}

          <Stack direction="row" spacing={1} className="flex items-center p-2">
            <TextField
              placeholder="Clases"
              value={classInput}
              onChange={(e) => setClassInput(e.target.value)}
              id="outlined-required"
              label="Clases"
              onKeyPress={(e) => onKeyUp(e)}
              className="w-full"
            />
            <IconButton
              size="small"
              className="h-8 w-8"
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
            <Button variant="outlined" color="success" endIcon={<SendIcon />}>
              Send
            </Button>
          </Stack>
        </Box>
      </div>
    </div>
  );
};

export default Classes;
