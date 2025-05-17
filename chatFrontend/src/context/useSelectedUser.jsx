import { createContext, useContext } from "react";

export const selectedUserContext = createContext(null);

// Custom hook
export const useSelectedUser = () => {
  const context = useContext(selectedUserContext);
  if (!context) {
    throw new Error(
      "useSelectedUser must be used within a SelectedUserContextProvider"
    );
  }
  return context;
};
