interface GuardiaGroupSelectionProps {
  selectedClass: any;
  setSelectedClass: any;
  classes: any;
}

export const GuardiaGroupSelection: React.FC<GuardiaGroupSelectionProps> = ({
  selectedClass,
  setSelectedClass,
  classes,
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-3 justify-between items-center mb-3">
      {/* Group Selection */}
      <div className="w-full sm:w-48">
        <label htmlFor="classroom" className="text-sm block mb-1">
          Lugar:
        </label>
        <select
          className="w-full h-8 border-[1px] border-gray-300 shadow-sm sm:text-sm rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          id="classroom"
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
        >
          {classes.map((classroom: any, index: any) => (
            <option key={index} value={classroom}>
              {classroom}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
