import { createContext, useContext } from "react";

export const UserContext = createContext(undefined);

const useUserContext = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUserContext must be used within UserContextProvider");
  }
  return context;
};

export default useUserContext;
