import { useEffect } from "react";
import useMessages from "../Hooks/useMessages";
import { useSelectedUser } from "../context/useSelectedUser";
import useUserContext from "../context/useUser";
import Chat from "./Chat";

const ChatContainer = () => {
  const { user } = useUserContext();
  const { selectedUser } = useSelectedUser();
  const { messages, loading, error, getMessages, subscribeToMessages } =
    useMessages();

  useEffect(() => {
    if (!selectedUser?._id) return;

    // 1. Load historical messages
    getMessages(selectedUser._id);

    // 2. Subscribe to real-time updates
    const cleanup = subscribeToMessages(selectedUser._id);

    return cleanup;
  }, [selectedUser?._id]);

  return (
    <>
      <Chat
        messages={messages}
        loading={loading}
        error={error}
        selectedUser={selectedUser}
        currentUser={user}
      />
    </>
  );
};

export default ChatContainer;
