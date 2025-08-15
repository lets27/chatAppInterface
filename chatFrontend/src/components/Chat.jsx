import { useEffect, useRef } from "react";
import ChatHeader from "./chatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./MessageSkeleton";

const Chat = ({ messages, loading, error, selectedUser, currentUser }) => {
  const messagesEndRef = useRef(null);

  console.log(messages);
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (loading) return <MessageSkeleton />;
  if (error)
    return <div className="p-4 text-red-500">Error: {error.message}</div>;
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return ""; // fallback for invalid dates
    return date.toLocaleString([], {
      hour: "2-digit",
      minute: "2-digit",
      day: "numeric",
      month: "short",
    });
  };

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader user={selectedUser} />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => {
          const isCurrentUser = msg.senderId === currentUser._id;
          const profilePic = isCurrentUser
            ? currentUser.profilePicture || "/avatar.png"
            : selectedUser.profilePicture || "/avatar.png";

          return (
            <div
              key={index}
              className={`chat ${isCurrentUser ? "chat-end" : "chat-start"}`}
            >
              <div className="chat-image avatar">
                <div className="size-10 rounded-full border">
                  <img src={profilePic} alt="profile" />
                </div>
              </div>

              <div className="chat-header mb-1">
                <time className="text-xs opacity-50 ml-1">
                  {formatDate(msg.createdAt)}
                </time>
              </div>

              <div
                className={`chat-bubble font-semibold flex flex-col shadow-md rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  isCurrentUser
                    ? "bg-green-500 text-white"
                    : "bg-blue-100 text-blue-900"
                }`}
              >
                {msg.image && (
                  <img
                    src={msg.image}
                    alt="Attached content"
                    className="rounded-lg mb-2 max-w-[280px] sm:max-w-xs object-cover border border-gray-200"
                  />
                )}
                {msg.text && (
                  <p
                    className={`${
                      msg.image ? "pt-2 border-t border-white/20" : ""
                    }`}
                  >
                    {msg.text}
                  </p>
                )}
              </div>
            </div>
          );
        })}

        {/* Add an empty div at the end with the ref */}
        <div ref={messagesEndRef} />
      </div>

      <MessageInput />
    </div>
  );
};

export default Chat;
