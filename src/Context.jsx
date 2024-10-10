import { createContext, useState, useContext} from "react";


const MyContext = createContext();
const MyProvider = ({ children }) => {
    const [value,setValue] = useState(null)
  
    return (
      <MyContext.Provider value={{value,setValue}}>
        {children}
      </MyContext.Provider>
    );
  };
  
  const useMain = () =>{
    return useContext(MyContext)
  }
  export {MyProvider , useMain }