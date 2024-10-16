import { createContext, useState, useContext} from "react";


const MyContext = createContext();
const MyProvider = ({ children }) => {
    const [musicId,setMusicId] = useState(null)
    const [isUser,setIsUser] = useState(false)

    return (
      <MyContext.Provider value={{musicId,setMusicId,isUser,setIsUser}}>
        {children}
      </MyContext.Provider>
    );
  };
  
  const useMain = () =>{
    return useContext(MyContext)
  }
  export {MyProvider , useMain }