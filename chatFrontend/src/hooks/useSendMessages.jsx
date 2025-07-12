import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { useSocket } from "../context/useSocket";
import { useSelectedUser } from "../context/useSelectedUser";
import useMessageContext from "../context/useMessageContext";
import { baseUrl } from "../util";

const useSendMessages = () => {
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
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

  const sendMessages = async (submitData) => {
    try {
      setSending(true);
      const token = localStorage.getItem("chatToke");
      const id = submitData.get("recieverId");
      if (!token) {
        localStorage.removeItem("chatToke");
        toast.success("please login!");
        navigate("/login");
        return;
      }

      const data = await fetch(`${baseUrl}/api/official/send/${id}`, {
        mode: "cors",
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: submitData,
      });

      if (![200, 201].includes(data.status)) {
        const err = await data.json();
        throw new Error(err?.error || "Message sending failed");
      }

      toast.success("message sent");
      // no need to manually update setMessages here because socket will handle it
    } catch (error) {
      toast.error(error.message);
      setError(error);
    } finally {
      setSending(false);
    }
  };

  return {
    sendMessages,
    error,
    sending,
  };
};

export default useSendMessages;
