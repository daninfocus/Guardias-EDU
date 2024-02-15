interface TeacherSelectionSectionProps {
  selectedTeacher: any;
  setSelectedTeacher: any;
  teachers: any;
}

export const TeacherSelectionSection: React.FC<TeacherSelectionSectionProps> = ({
  selectedTeacher,
  setSelectedTeacher,
  teachers,
}) => {
  return (
    <div className="w-full h-16 ">
      <label className="text-sm my-3">Profesor</label>
      <select
        className="w-full h-8 border-[1px] border-gray-300 shadow-sm sm:text-sm rounded-md focus:ring-indigo-500 focus:border-indigo-500"
        value={selectedTeacher}
        onChange={(e) => setSelectedTeacher(e.target.value)}
      >
        {teachers.map((teacher: any, index: any) => (
          <option key={index} value={teacher}>
            {teacher}
          </option>
        ))}
      </select>
    </div>
  );
};
