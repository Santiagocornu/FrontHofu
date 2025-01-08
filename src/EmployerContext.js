import React, { createContext, useState } from 'react';

export const EmployerContext = createContext();

export const EmployerProvider = ({ children }) => {
  const [selectedEmployerId, setSelectedEmployerId] = useState(null);

  return (
    <EmployerContext.Provider value={{ selectedEmployerId, setSelectedEmployerId }}>
      {children}
    </EmployerContext.Provider>
  );
};


