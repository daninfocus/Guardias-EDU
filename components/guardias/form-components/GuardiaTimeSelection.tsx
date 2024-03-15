import React from "react";

interface GuardiaTimeSelectionProps {
  selectedHourIndex: number;
  setSelectedHourIndex: any;
  hours: any;
}

const GuardiaTimeSelection: React.FC<GuardiaTimeSelectionProps> = ({
  selectedHourIndex,
  setSelectedHourIndex,
  hours,
}) => {
  return (
    <div className="w-full sm:w-48 mb-3 sm:mb-0">
      <label htmlFor="hour" className="text-sm block mb-1">
        Hora:
      </label>
      <select
        className="w-full h-8 border-[1px] border-gray-300 shadow-sm sm:text-sm rounded-md focus:ring-indigo-500 focus:border-indigo-500"
        id="hour"
        value={selectedHourIndex}
        onChange={(e) => setSelectedHourIndex(e.target.value)}
      >
        {hours.map((hour: any, index: any) => (
          <option key={index} value={index}>
            {hour}
          </option>
        ))}
      </select>
    </div>
  );
};

export default GuardiaTimeSelection;
