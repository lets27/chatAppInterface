import { useSelectedUser } from "../context/useSelectedUser";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useSelectedUser();
  // const { user } = useUserContext();

  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="avatar relative">
            <div className=" size-10 rounded-full relative">
              <img
                src={selectedUser.profilePic || "/avatar.png"}
                alt={selectedUser.username}
              />
            </div>
          </div>

          {/* User info */}
          <div>
            <h3 className="font-medium">{selectedUser.username}</h3>
            <p className="text-sm text-base-content/70"></p>
          </div>
        </div>

        {/* Close button */}
        <button onClick={() => setSelectedUser(null)}>X</button>
      </div>
    </div>
  );
};

export default ChatHeader;
