import React, { useContext } from "react";
import Nav from "../components/Nav";
import GuardiasContext from "../context/GuardiasContext";

const Profesorado = () => {
  const { college } = useContext(GuardiasContext);

  return (
    <div className="h-screen">
      <Nav simpleNav={true} />
      <div className="mt-auto w-full h-full">
        {college.teachers?.map((teacher, index) => {
          return (
            <h1 key={index}>
              <p className="items-center text-center">{teacher.email}<button> Borrar</button></p>
              
            </h1>
          );
        })}
      </div>
    </div>
  );
};

export default Profesorado;
