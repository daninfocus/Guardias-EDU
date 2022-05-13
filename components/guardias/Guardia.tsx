import React from "react";

const Guardia = () => {
  return (
    <div className="grid grid-cols-3 gap-1 rounded-lg bg-slate-600 h-full w-full p-2">
      <div className="text-white font-bold col-span-2 md:text-sm text-xs flex items-center invisible sm:visible">Guardias:</div>
      <div className="text-white font-bold flex flex-row justify-end flex items-center md:text-lg text-sm">2</div>
      <div className="text-white font-bold flex flex-row justify-end">·</div>
      <div className="text-white font-bold col-span-2 md:text-sm text-xs">2 ESO</div>
      <div className="text-white font-bold flex flex-row justify-end">·</div>
      <div className="text-white font-bold col-span-2 md:text-sm text-xs">Info 2</div>
    </div>
  );
};

export default Guardia;
