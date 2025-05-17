import { useEffect } from "react";
import useMessageContext from "../context/useMessageContext";
import { useSelectedUser } from "../context/useSelectedUser";
import { useSocket } from "../context/useSocket";

// useListenToMessages.ts
const useListenToMessages = () => {
  const { socket } = useSocket();
  const { selectedUser } = useSelectedUser();
  const { setMessages } = useMessageContext();

  const selectedUserId = selectedUser._id;
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (newMessage) => {
      console.log("Received latestMessage:", newMessage);

      // Only add if the message is from/to the selected user
      if (
        newMessage.senderId === selectedUserId ||
        newMessage.recieverId === selectedUserId
      ) {
        setMessages((prev) => [...prev, newMessage]);
      }
    };

    socket.on("latestMessage", handleNewMessage);

    return () => {
      socket.off("latestMessage", handleNewMessage);
    };
  }, [socket, selectedUserId]);
  // 👆 very important: depends on selectedUser too
};

export default useListenToMessages;
