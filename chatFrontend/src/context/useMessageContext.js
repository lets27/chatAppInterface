import { createContext, useContext } from "react";

// Create the context with the correct type
export const MessageContext = createContext(null);

const useMessageContext = () => {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error("useMessageContext must be used inside a MessageProvider");
  }
  return context;
};

export default useMessageContext;
