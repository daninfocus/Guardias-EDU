import React, { useContext } from "react";
import AuthCheck from "../components/auth/AuthCheck";
import { GuardiasContextProvider } from "../context/GuardiasContext";
import CollegeModel from "../@types/College";
import Form from "../components/guardias/Form";
import GuardiaModel from "../@types/Guardia";
import GuardiasContext from "../context/GuardiasContext";
import AuthContext from "../context/AuthContext";
import toast, { Toaster } from "react-hot-toast";
import MainCalendar from "../components/calendar/MainCalendar";
import Nav from "../components/Nav";

const Home = () => {
  const { college } = useContext(GuardiasContext);
  const { showGuardiaForm } = useContext(GuardiasContext);
  const { setShowGuardiaForm } = useContext(GuardiasContext);
  return (
    <AuthCheck>
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
      <div className="bg-gray-100 flex-1 flex flex-col overflow-x-hidden">
        <title>{"Guardias - " + college.name}</title>
        <Nav simpleNav={false} />

        {showGuardiaForm ? <Form /> : null}
        <MainCalendar />
        <div className="h-[6px]"></div>
      </div>
    </AuthCheck>
  );
};

export default Home;
