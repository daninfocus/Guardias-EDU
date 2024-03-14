import React, { createContext, useState, ReactNode } from "react";

interface FormContextType {
  isFormOpen: boolean;
  openForm: (date: Date) => void;
  closeForm: () => void;
  selectedDate?: Date;
}

const defaultContextValue: FormContextType = {
  isFormOpen: false,
  openForm: (date: Date) => {},
  closeForm: () => {},
  selectedDate: new Date(),
};

const FormContext = createContext<FormContextType>(defaultContextValue);

export const FormContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isFormOpen, setFormOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const openForm = (dateSelected?: Date) => {
    if (dateSelected) {
      setSelectedDate(dateSelected);
    }
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
  };

  return (
    <FormContext.Provider
      value={{ isFormOpen, openForm, closeForm, selectedDate }}
    >
      {children}
    </FormContext.Provider>
  );
};

export default FormContext;
