import React, { Suspense, useContext, useEffect } from "react";
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
import FormContext from "../context/FormContext";
import Loading from "../components/Loading";

const Home = () => {
  const { college } = useContext(AuthContext);
  const { isFormOpen, openForm, closeForm } = useContext(FormContext);

  return (
    <Suspense fallback={<Loading />}>
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
        <div className="bg-gray-100 flex flex-col overflow-hidden h-screen">
          <title>{"Guardias - " + college.name}</title>
          <Nav simpleNav={false} />

          {isFormOpen ? <Form /> : null}
          <MainCalendar />
        </div>
      </AuthCheck>
    </Suspense>
  );
};

export default Home;
