import React, { useContext, useEffect, useState } from "react";
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

const CreateCollegeForm = () => {
  const router = useRouter();

  const { user } = useContext(AuthContext);

  const [college, setCollege] = useState("");

  const [hasErrorCollege, setHasErrorCollege] = useState(false);

  const [hasErrorClasses, setHasErrorClasses] = useState(false);

  const [classInput, setClassInput] = useState("");

  const [classes, setClasses] = useState<Array<string>>([]);

  useEffect(() => {
    if(user==undefined){
      router.replace("/");
    }
    setHasErrorClasses(false);
    setHasErrorCollege(false);
  }, [classes, college, user,router]);

  const addClass = () => {
    var classSanitized = removeExtraSpace(classInput);
    setClasses([...classes, classSanitized]);
  };

  const deleteClass = (index: number) => {
    classes.splice(index, 1);
    setClasses([...classes]);
  };
  const handleChange = (newCollegeName: string) => {
    setCollege(newCollegeName);
  };

  function newCollege() {
    if (college.length >= 5) {
      if (classes.length >= 2) {
        const collegeObject: CollegeModel = {
          name: college,
          createdAt: new Date(),
          updatedAt: new Date(),
          admins: [user.email],
          teachers: [user.email],
          classes: classes
        };

        var newCollege = addDocument("colleges", collegeObject).then((id) => {
          toast.success("College Added", {
            icon: "✅",
          });
          router.replace("/" + id);
        });
        if (newCollege == null) {
          toast("Error guardando el instituto", {
            icon: "⛔️",
          });
        }
      } else {
        setHasErrorClasses(true);
      }
    } else {
      setHasErrorCollege(true);
    }
  }

  const onKeyUp = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.charCode === 13) {
      addClass();
    }
  };

  const removeExtraSpace = (s: string) => s.trim().split(/ +/).join(" ");

    return (
      <div className="static w-full">
        <Box
          component="form"
          sx={{
            minWidth: 220,
          }}
          noValidate
          autoComplete="off"
        >
          <TextField
            placeholder="Instituto"
            value={college}
            onChange={(e) => handleChange(e.target.value)}
            id="outlined-required"
            label="Nombre"
            required
            className="w-full"
          />
          {hasErrorCollege && (
            <FormHelperText className="text-red-500">
              El nombre tiene que tener al menos 5 letras
            </FormHelperText>
          )}
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
                : "h-80 overflow-scroll overflow-x-hidden"
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
            <h2 className="w-full flex flex-row justify-end">
              Classes: {classes.length}
            </h2>
          )}

          <Stack direction="row" spacing={1} className="flex items-center">
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
          {hasErrorClasses && (
            <FormHelperText className="text-red-500">
              Tienes que guardar al menos 2 clases, solo el administrador puede
              modificar las clases.
            </FormHelperText>
          )}
          <Stack
            direction="row"
            spacing={2}
            className="flex flex-row items-center justify-center mt-4"
          >
            <Button
              variant="outlined"
              color="success"
              endIcon={<SendIcon />}
              onClick={() => newCollege()}
            >
              Send
            </Button>
          </Stack>
        </Box>
        <p className="absolute text-sm w-full p-9 left-0 flex flex-row items-center justify-center text-red-400 font-bold">
          *Creando un Instituto nuevo te hará responsable del mismo, gestionando
          los profesores y las clases. Consulta con tu Jefe del departamento.
        </p>
      </div>
    );
};

export default CreateCollegeForm;
