import { User } from "firebase/auth";
import React, {
  Fragment,
  SyntheticEvent,
  useContext,
  useEffect,
  useState,
} from "react";
import Calendar from "react-calendar";
import College from "../../@types/College";
import Guardia from "../../@types/Guardia";
import toast, { Toaster } from "react-hot-toast";
import router, { useRouter } from "next/router";
import AuthContext from "../../context/AuthContext";
import * as days from "../../shared/dates";
import ColorPicker from "../ColorPicker";
import SelectDialog from "../SelectDialog";
import { Dialog, Transition } from "@headlessui/react";
import GuardiasContext from "../../context/GuardiasContext";
import { teacherRef } from "../../firebase/firestore";
import FormContext from "../../context/FormContext";
import CalendarContext from "../../context/CalendarContext";
import { isDateInSlot } from "../../logic/functions";
import { CloseButton } from "./form-components/CloseButton";
import { ColorPickerSection } from "./form-components/ColorPickerSection";
import { CalendarSection } from "./form-components/CalendarSelection";
import { TeacherSelectionSection } from "./form-components/TeacherSelection";
import { TimeAndGroupSelection } from "./form-components/TimeAndGroupSelection";
import { TextAreaSection } from "./form-components/TextAreaSection";
import FormFooter from "./form-components/FormFooter";
import TipTapEditor from "./form-components/TipTapEditor";
import { JSONContent } from "@tiptap/react";

export default function Form() {
  const colors = [
    "#7DD3FC",
    "#FDA4AF",
    "#6EE7B7",
    "#FDE68A",
    "#C4B5FD",
    "#CBD5E1",
  ];

  //context
  const { collegeId } = router.query;
  const { user, isUserAdmin } = useContext(AuthContext);
  const { isFormOpen, openForm, closeForm, selectedDate } =
    useContext(FormContext);
  const { college } = useContext(AuthContext);
  const { guardias, addOrUpdateGuardia, removeGuardia, saveGuardia } =
    useContext(GuardiasContext);
  const { schedule } = useContext(CalendarContext);

  const hours = schedule.map((item: any, index: number) => {
    return (
      (item.label ? item.label : "") +
      " " +
      item.start.hours.toString().padStart(2, "0") +
      ":" +
      item.start.minutes.toString().padStart(2, "0") +
      "\t-\t" +
      item.end.hours.toString().padStart(2, "0") +
      ":" +
      item.end.minutes.toString().padStart(2, "0")
    );
  });

  const getSelectedTimeSlot = () =>
    schedule.findIndex((slot: any) => {
      return selectedDate
        ? isDateInSlot(selectedDate, slot, selectedDate?.getDay())
        : -1;
    });

  //state
  const [selectedColor, setSelectedColor] = useState(
    Math.floor(Math.random() * 6)
  );
  const [date, setDate] = useState<Date>(
    selectedDate ? selectedDate : new Date()
  );
  const [isOpen, setIsOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState(college.classes[0]);
  const [selectedHour, setSelectedHour] = useState(
    hours[getSelectedTimeSlot()]
  );
  const [tasks, setTasks] = useState<JSONContent>();
  const [moreInfo, setMoreInfo] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState("");



  useEffect(() => {
    setSelectedHour(hours[getSelectedTimeSlot()]);
  }, [selectedDate]);

  // useEffect(() => {
  //   if (!pressedNewGuardia && guardiaToEdit.classroom != undefined) {
  //     setSelectedClass(guardiaToEdit.classroom);
  //     setSelectedHour(guardiaToEdit.hour.toString());
  //     setSelectedColor(guardiaToEdit.color);
  //     setDate(guardiaToEdit.dayOfGuardia);
  //     setTasks(guardiaToEdit.tasks);
  //     setMoreInfo(guardiaToEdit.moreInfo==null?"":guardiaToEdit.moreInfo);
  //   }
  // }, [pressedNewGuardia]);

  const submitGuardia = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    if (collegeId != undefined && user) {
      let docId = "";
      if (selectedTeacher) {
        let teacherObject = await teacherRef(selectedTeacher);
        docId = teacherObject.docs[0].id;
      } else {
        let teacherObject = await teacherRef(user.email!);
        docId = teacherObject.docs[0].id;
      }
      const guardia: Guardia = {
        dayOfGuardia: date,
        createdAt: new Date(),
        teacher: null,
        teacherDocId: docId,
        teacherEmail: selectedTeacher ? selectedTeacher : user.email,
        collegeId: collegeId.toString(),
        updatedAt: null,
        tasks: tasks,
        moreInfo: moreInfo,
        classroom: selectedClass,
        hour: parseInt(selectedHour),
        color: selectedColor,
        isEmpty: false,
      };
      saveGuardia(guardia);
      // if (!pressedNewGuardia || !showGuardiaForm) {
      //   guardia.id = guardiaToEdit.id;
      //   saveEditedGuardia(guardia);
      // } else {
      //   saveGuardia(guardia);
      // }
    }
  };

  const changeColor = (number: number) => {
    setSelectedColor(number);
  };

  const handleClickOutside = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.stopPropagation();
    setIsOpen(false);
  };

  const childClick = (event: MouseEvent) => {
    event.stopPropagation();
    setIsOpen(true);
  };

  return (
    <>
      <Toaster
        position="bottom-center"
        toastOptions={{
          duration: 5000,
          style: { background: "#363636", color: "#fff" },
        }}
      />
      <Transition appear show={true}>
        <Dialog as="div" className="relative z-10" onClose={() => closeForm()}>
          <div className="fixed inset-0 bg-black bg-opacity-25" />
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center md:p-4 text-center">
              <Dialog.Panel className="transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
                <div className="bg-slate-600 flex justify-between items-center p-3 rounded-t-2xl">
                  <p className="text-slate-200 font-medium">
                    Día seleccionado:{" "}
                    <span className="font-light">
                      {selectedDate?.toLocaleDateString() +
                        "-" +
                        selectedDate?.getHours() +
                        ":" +
                        selectedDate?.getMinutes()}
                    </span>
                  </p>
                  <CloseButton onClick={() => closeForm()} />
                </div>
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  <form className=" bg-white p-4 rounded-lg flex sm:flex-row flex-col h-full">
                    <div className="flex flex-col p-2">
                      <ColorPickerSection
                        selectedColor={selectedColor}
                        changeColor={changeColor}
                        colors={colors}
                      />
                      <CalendarSection date={date} setDate={setDate} />
                    </div>
                    <TipTapEditor setState={setTasks}/>
                    <div className="flex flex-col p-2">
                      {isUserAdmin() && (
                        <TeacherSelectionSection
                          selectedTeacher={selectedTeacher}
                          setSelectedTeacher={setSelectedTeacher}
                          teachers={college.teachers}
                        />
                      )}
                      <TimeAndGroupSelection
                        selectedHour={selectedHour}
                        setSelectedHour={setSelectedHour}
                        hours={hours}
                        selectedClass={selectedClass}
                        setSelectedClass={setSelectedClass}
                        classes={college.classes}
                      />
                      <TextAreaSection
                        label="Más Información"
                        id="moreInfo"
                        value={moreInfo}
                        onChange={(e) => setMoreInfo(e.target.value)}
                      />
                      <FormFooter
                        onSubmit={(e: React.SyntheticEvent) => submitGuardia(e)}
                        onCancel={() => closeForm()}
                        submitLabel="Guardar"
                        cancelLabel="Cerrar"
                        isSubmitDisabled={false}
                      />
                    </div>
                  </form>
                </Dialog.Title>
              </Dialog.Panel>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
