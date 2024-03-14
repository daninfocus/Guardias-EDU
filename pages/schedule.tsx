import React from "react";
import Nav from "../components/Nav";
import { Toaster } from "react-hot-toast";
import AuthCheck from "../components/auth/AuthCheck";
import ScheduleComponent from "../components/schedule/ScheduleComponent";
import AreasComponent from "../components/schedule/AreasComponent";

const Schedule = () => {
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
      <div className="flex flex-col gap-7 m-auto h-full w-full items-center">
        <span>Horario:</span>
        <ScheduleComponent />
        <span>Areas:</span>
        
        <AreasComponent />
      </div>
    </AuthCheck>
  );
};

export default Schedule;
