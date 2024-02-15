import { DayPicker } from "react-day-picker";
import 'react-day-picker/dist/style.css';
import { es } from 'date-fns/locale';

interface CalendarSectionProps {
  date: Date;
  setDate: React.Dispatch<React.SetStateAction<Date>>;
}

export const CalendarSection: React.FC<CalendarSectionProps> = ({ date, setDate }) => {
  return (
    <div className="rounded-2xl mb-3 self-center w-full">
      <DayPicker
        mode="single"
        selected={date}
        onSelect={()=>setDate}
        locale={es}
        showOutsideDays
        fixedWeeks
      />
      {/* <Calendar onChange={setDate} value={date} minDate={new Date()} /> */}
    </div>
  );
};
