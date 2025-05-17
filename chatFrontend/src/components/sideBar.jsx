import { Loader, Users } from "lucide-react";
import { useSelectedUser } from "../context/useSelectedUser";

import { useSocket } from "../context/useSocket";
import { useState } from "react";
import useGetUsers from "../hooks/useGetUsers";

const UsersSideBar = () => {
  const { users, loadingUsers } = useGetUsers();
  const { onlineUsers } = useSocket();
  const { selectedUser, setSelectedUser } = useSelectedUser();
  const [showOnlineUsers, setShowOnlineUsers] = useState(false); // state to toggle online users
  //filter online users from the array of objects

  console.log("onlineUsers", onlineUsers);
  const filteredUsers = showOnlineUsers
    ? users.filter((user) => onlineUsers.some((u) => u.userId === user._id))
    : users.filter((user) => onlineUsers.some((u) => u.userId !== user._id));

  if (loadingUsers) {
    return <p>loading users...</p>;
  }

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200 font-montserrat">
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2">
          <Users className="size-6" />
          <span className="font-medium hidden lg:block">Contacts</span>
        </div>
        {/* TODO: Online filter toggle */}
      </div>
      <button onClick={() => setShowOnlineUsers(!showOnlineUsers)}>
        {showOnlineUsers ? " show all Users" : " show online users"}
      </button>
      <div className="overflow-y-auto w-full py-3">
        {filteredUsers.map((user) => (
          <button
            key={user._id}
            onClick={() => setSelectedUser(user)} //get id from selcted user
            className={`
              w-full p-3 flex items-center gap-3
              hover:bg-base-300 transition-colors
              ${
                selectedUser === user._id
                  ? "bg-base-300 ring-1 ring-base-300"
                  : ""
              }
            `}
          >
            <div className="relative mx-auto lg:mx-0">
              <img
                src={(user && user.profilePicture) || "/avatar.png"}
                alt={user && user.username}
                className="size-12 object-cover rounded-full"
              />
              {/* give the type script set up set up of  online users being an aray of objects */}
              {onlineUsers.some((u) => u.userId === user._id) && (
                <div className="bg-green-500 rounded-full ring-2 ring-zinc-900 size-3 bottom-0 absolute"></div>
              )}
            </div>

            {/* User info - only visible on larger screens */}
            <div className="hidden lg:block text-left min-w-0">
              <div className="font-medium truncate">{user.username}</div>
              <div className="text-sm text-zinc-400"></div>
            </div>
          </button>
        ))}

        {users.length === 0 && (
          <div className="text-center text-zinc-500 py-4">No online users</div>
        )}
      </div>
    </aside>
  );
};

export default UsersSideBar;
