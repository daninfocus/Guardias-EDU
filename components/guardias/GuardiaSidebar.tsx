import React, { Dispatch, SetStateAction, useState } from "react";
import Guardia from "../../@types/Guardia";
import {
  ChevronDoubleUpIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/solid";
import TipTapEditor from "./form-components/TipTapEditor";
import { JSONContent } from "@tiptap/react";
import { CloseButton } from "./form-components/CloseButton";
import GuardiaSidebarCard from "./GuardiaSidebarCard";

type GuardiaSidebarProps = {
  openGuardias: boolean;
  setOpenGuardias: Function;
  guardias: Guardia[];
  backgroundColor: (dim: boolean, guardia: Guardia) => string;
  openGuardia: (guardia: Guardia) => void;
};

const GuardiaSidebar: React.FC<GuardiaSidebarProps> = ({
  openGuardias,
  setOpenGuardias,
  guardias,
  backgroundColor,
}) => {
  return (
    <nav
      className={`navbar-menu  top-0 z-40 transition-transform duration-300  transform h-full w-full ${
        openGuardias ? "translate-x-0" : "translate-x-full"
      } fixed top-0 right-0 bottom-0 flex flex-col md:w-5/6 w-full md:max-w-sm py-4 px-4 bg-white border-r overflow-y-auto`}
    >
      <CloseButton onClick={()=>setOpenGuardias()}/>


      {guardias.map((element, index) => {
        return (
          <div key={index}>
            <GuardiaSidebarCard guardia={element} backgroundColor={backgroundColor}/>
          </div>
        );
      })}
    </nav>
  );
};

export default GuardiaSidebar;
