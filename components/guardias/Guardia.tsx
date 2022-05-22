import React from "react";

const Guardia = () => {
  return (
    <div className="grid grid-cols-3 gap-1 rounded-lg bg-slate-600 h-full w-full p-2">
      <div className="text-white font-bold col-span-3 flex flex-row justify-end items-center md:text-base text-sm">2</div>
      <div className="text-white font-bold flex flex-row justify-end">·</div>
      <div className="text-white font-bold col-span-2 md:text-sm text-xs">2 ESO</div>
      <div className="text-white font-bold flex flex-row justify-end">·</div>
      <div className="text-white font-bold col-span-2 md:text-sm text-xs">Info 2</div>
    </div>
  );
};

export default Guardia;
