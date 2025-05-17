import { useCallback, useState } from "react";
import useMessageContext from "../context/useMessageContext";
import { useSocket } from "../context/useSocket";
import useUserContext from "../context/useUser";
import { baseUrl } from "../util";

const useMessages = () => {
  const { messages, setMessages } = useMessageContext();
  const { socket } = useSocket();
  const { user } = useUserContext();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch initial messages
  const getMessages = async (selectedUserId) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("chatToke");
      if (!token) throw new Error("Not authenticated");

      const res = await fetch(`${baseUrl}/api/official/${selectedUserId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to get messages");

      const data = await res.json();
      setMessages(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Real-time subscription
  const subscribeToMessages = useCallback(
    (selectedUserId) => {
      if (!socket || !selectedUserId || !user?._id) return;

      const handleNewMessage = (newMessage) => {
        if (isRelevantMessage(newMessage, selectedUserId, user._id)) {
          setMessages((prev) => {
            // Prevent duplicates
            if (!prev.some((msg) => msg._id === newMessage._id)) {
              return [...prev, newMessage];
            }
            return prev;
          });
        }
      };

      socket.on("latestMessage", handleNewMessage);
      return () => socket.off("latestMessage", handleNewMessage);
    },
    [socket, user?._id, setMessages]
  );

  return {
    messages,
    loading,
    error,
    getMessages,
    subscribeToMessages,
  };
};

// Helper function
function isRelevantMessage(message, selectedUserId, currentUserId) {
  return (
    (message.senderId === selectedUserId &&
      message.receiverId === currentUserId) ||
    (message.receiverId === selectedUserId &&
      message.senderId === currentUserId)
  );
}

export default useMessages;
