import { createContext } from "react";

const MyContext = createContext();

const MyProvider = ({ children }) => {
    const value = { /* your state and functions here */ };
  
    return (
      <MyContext.Provider value={value}>
        {children}
      </MyContext.Provider>
    );
  };

  export {MyProvider , MyContext}