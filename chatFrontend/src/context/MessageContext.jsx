// context/MessageContext.tsx
import { useState } from "react";
import { MessageContext } from "./useMessageContext";

export const MessageProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);

  return (
    <MessageContext.Provider value={{ messages, setMessages }}>
      {children}
    </MessageContext.Provider>
  );
};
