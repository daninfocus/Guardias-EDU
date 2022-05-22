import React from "react";
import Guardia from "../../models/Guardia";

const Guardia = (prop: { guardias: Array<Guardia> }) => {
  if (prop.guardias[0].id == "empty") {
    return <></>;
  } else {
    return (
      <div className="hover:bg-slate-400 grid grid-cols-3 gap-1 rounded-lg bg-slate-600 w-full h-full p-2 break-words overflow-hidden">
        <div className="text-white font-bold col-span-3 flex flex-row justify-end items-center text-xs h-4">
          <div className=" bg-red-500 rounded-full w-4 h-4">
            <div className="-top-[1px] left-1 relative">{prop.guardias.length}</div>
          </div>
        </div>
        {prop.guardias.map((element, index) => {
          return (
            <div
              key={index}
              className="overflow-hidden text-slate-300 font-bold col-span-3 flex flex-row justify-between"
            >
              <p>{element.classroom}</p>
              <p>&nbsp;&nbsp;&nbsp;&nbsp;</p>
              <p>{element.teacherName}</p>
            </div>
          );
        })}
      </div>
    );
  }
};

export default Guardia;
