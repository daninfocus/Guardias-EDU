import React, { useContext } from "react";
import Nav from "../components/Nav";
import GuardiasContext from "../context/GuardiasContext";

const Profesorado = () => {

  const { college } = useContext(GuardiasContext);

  return (
    <div>
      <Nav simpleNav={true} />
      {college.teachers?.map((teacher, index) => {
        console.log(teacher);
        return <h1 key={index}><p>{teacher}</p></h1>;
      })}
    </div>
  );
};

export default Profesorado;
