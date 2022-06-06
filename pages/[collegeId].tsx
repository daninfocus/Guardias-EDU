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
  const { showNewGuardia } = useContext(GuardiasContext);
  const { setShowNewGuardia } = useContext(GuardiasContext);
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
      <div className="bg-gray-100 h-screen flex flex-col overflow-y-hidden overflow-x-hidden">
        <title>{"Guardias - " + college.name}</title>
        <Nav simpleNav={false} />

        {showNewGuardia ? <Form /> : null}
        <MainCalendar />
      </div>
    </AuthCheck>
  );
};

export default Home;
