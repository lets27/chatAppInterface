import { useMemo, useState } from "react";
import { selectedUserContext } from "./useSelectedUser";

const SelectedUserContextProvider = ({ children }) => {
  const [selectedUser, setSelectedUser] = useState(null);

  const value = useMemo(() => {
    return { selectedUser, setSelectedUser };
  }, [selectedUser, setSelectedUser]);

  return (
    <selectedUserContext.Provider value={value}>
      {children}
    </selectedUserContext.Provider>
  );
};

export default SelectedUserContextProvider;
