import { useState } from "react";
import toast from "react-hot-toast";
import useUserContext from "../context/useUser";
import useMessageContext from "../context/useMessageContext";
import { baseUrl } from "../util";

const useGetMessages = () => {
  const [loadingMessages, setLoadingMessages] = useState(true);
  const { messages, setMessages } = useMessageContext();
  const [error, setError] = useState(null);
  console.log("messages:", messages);
  const { setUser } = useUserContext();

  const getMessages = async (selectUserId) => {
    const token = localStorage.getItem("chatToke");
    if (!token) {
      setUser(null);
      setLoadingMessages(false);
      return;
    }

    const id = selectUserId;
    try {
      const res = await fetch(`${baseUrl}/api/official/messages/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error("Failed to get messages");
      }

      const messages = await res.json();
      console.log("useget:", messages);

      // Assuming data contains updatedUser
      setMessages(messages);
    } catch (err) {
      toast.error(err.message || "An error occurred");
      setError(err.message);
    } finally {
      setLoadingMessages(false);
    }
  };

  return {
    getMessages,
    loadingMessages,
    error,
    messages,
    setMessages,
  };
};

export default useGetMessages;
