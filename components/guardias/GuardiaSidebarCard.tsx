import React, { useState } from "react";
import Guardia from "../../@types/Guardia";
import TipTapEditor from "./form-components/TipTapEditor";
import { JSONContent } from "@tiptap/react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/solid";

type GuardiaSidebarCardProps = {
  guardia: Guardia;
  backgroundColor: any;
};

const GuardiaSidebarCard: React.FC<GuardiaSidebarCardProps> = ({
  guardia,
  backgroundColor,
}) => {

  const [tasks, setTasks] = useState<JSONContent>();
  const [expandGuardia, setExpandGuardia] = useState<boolean>();

  return (
    <div
      className={`relative w-full mt-3 h-min flex flex-col text-sm md:text-base link link-underline link-underline-black ${backgroundColor(
        true,
        guardia
      )} `}
      onClick={() => setExpandGuardia(!expandGuardia)}
    >
      <div className={`flex flex-row justify-between`}>
        <span className="underline">Lugar:</span>
        <span>{guardia.classroom}</span>

        <div className="cursor-pointer">
          {expandGuardia ? (
            <ChevronUpIcon height={25} width={25} />
          ) : (
            <ChevronDownIcon height={25} width={25} />
          )}
        </div>
      </div>
      {expandGuardia && (
        <div className="flex flex-col gap-3">
          <span>{guardia.teacherEmail}</span>
          {guardia.tasks && (
            <>
              <span className="underline">Tareas:</span>
              <TipTapEditor setState={setTasks} content={guardia.tasks} />
            </>
          )}
          <span className="underline">Más Información:</span>
          <span>{guardia.moreInfo}</span>
        </div>
      )}
    </div>
  );
};

export default GuardiaSidebarCard;
