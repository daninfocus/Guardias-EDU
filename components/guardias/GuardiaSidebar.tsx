import React, { useState } from "react";
import Guardia from "../../@types/Guardia";
import {
  ChevronDoubleUpIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/solid";

type GuardiaSidebarProps = {
  openGuardias: boolean;
  guardias: Guardia[];
  backgroundColor: (dim: boolean, guardia: Guardia) => string;
  openGuardia: (guardia: Guardia) => void;
};

const GuardiaSidebar: React.FC<GuardiaSidebarProps> = ({
  openGuardias,
  guardias,
  backgroundColor,
}) => {
  const [expandGuardia, setExpandGuardia] = useState<Guardia>();
  return (
    <nav
      className={`navbar-menu  top-0 z-40 transition-transform duration-300  transform h-full w-full ${
        openGuardias ? "translate-x-0" : "translate-x-full"
      } fixed top-0 right-0 bottom-0 flex flex-col md:w-5/6 w-full md:max-w-sm py-4 px-4 bg-white border-r overflow-y-auto`}
    >
      {guardias.map((element, index) => {
        return (
          <div
            key={index}
            className={`relative w-full h-min flex flex-col text-sm md:text-base link link-underline link-underline-black ${backgroundColor(
              true,
              element
            )} `}
            onClick={() => setExpandGuardia(element)}
          >
            <div className={`flex flex-row justify-between`}>
              <span>{element.classroom}</span>

              <div className="cursor-pointer">
                {expandGuardia == element ? (
                    <ChevronUpIcon height={25} width={25} />
                ) : (
                    <ChevronDownIcon height={25} width={25} />
                )}
              </div>
            </div>
            { (
              <div className="flex flex-col gap-3">
                <span>{element.teacherEmail}</span>
                <span>Tareas: {element.tasks}</span>
                <span>Más Información:{element.moreInfo}</span>
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
};

export default GuardiaSidebar;
