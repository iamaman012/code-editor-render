import { useState, useContext, createContext } from "react";

const SocketContext = createContext();

const SocketProvider = ({ children }) => {
  const [code, setCode] = useState();
  return (
    <SocketContext.Provider value={[code, setCode]}>
      {children}
    </SocketContext.Provider>
  );
};

const useSocket = () => useContext(SocketContext);
export { useSocket, SocketProvider };
