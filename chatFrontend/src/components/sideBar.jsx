import { Loader, Users } from "lucide-react";
import { useSelectedUser } from "../context/useSelectedUser";

import { useSocket } from "../context/useSocket";
import { useState } from "react";
import useGetUsers from "../hooks/useGetUsers";
const UsersSideBar = () => {
  const { users, loadingUsers } = useGetUsers();
  const { onlineUsers } = useSocket();
  const { selectedUser, setSelectedUser } = useSelectedUser();
  const [showOnlineUsers, setShowOnlineUsers] = useState(false);
  const [open, setOpen] = useState(false); // toggle sidebar on small screens

  const filteredUsers = showOnlineUsers
    ? users.filter((user) => onlineUsers.some((u) => u.userId === user._id))
    : users;

  if (loadingUsers) return <p>loading users...</p>;

  return (
    <>
      {/* Mobile Toggle Button - Only visible on small screens */}
      <button
        className="fixed top-20 left-4 z-50 p-2  rounded-md shadow-lg sm:hidden"
        onClick={() => setOpen(true)}
        aria-label="Toggle sidebar"
      >
        <Users className="w-5 h-5" />
      </button>

      {/* Backdrop Overlay - Only visible on mobile when sidebar is open */}
      {open && (
        <div
          className="fixed inset-0 bg-black/30 z-40 sm:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
        fixed top-0 left-0 h-full w-64 bg-base-100 border-r border-base-300 flex flex-col transition-transform duration-300 z-50
        ${open ? "translate-x-0" : "-translate-x-full"} 
        sm:translate-x-0 sm:static sm:z-auto
      `}
      >
        {/* Sidebar Header */}
        <div className="border-b border-base-300 w-full p-5 flex items-center gap-2">
          <Users className="size-6" />
          <span className="font-medium hidden lg:block">Contacts</span>
          {/* Mobile Close Button */}
          <button
            className="ml-auto sm:hidden"
            onClick={() => setOpen(false)}
            aria-label="Close sidebar"
          >
            ✕
          </button>
        </div>

        {/* Online/All Users Toggle */}
        <button
          onClick={() => setShowOnlineUsers(!showOnlineUsers)}
          className="p-2 text-sm hover:underline text-left"
        >
          {showOnlineUsers ? "Show all users" : "Show online users"}
        </button>

        {/* Users List */}
        <div className="overflow-y-auto w-full py-3 flex flex-col gap-2">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <button
                key={user._id}
                onClick={() => {
                  setSelectedUser(user);
                  setOpen(false); // Close sidebar on mobile after selection
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-base-300 transition-colors ${
                  selectedUser?._id === user._id ? "bg-primary/20" : ""
                }`}
              >
                {/* User Avatar with Online Status */}
                <div className="relative mx-auto lg:mx-0">
                  <img
                    src={user?.profilePicture || "/avatar.png"}
                    alt={user.username}
                    className="size-12 object-cover rounded-full"
                    onError={(e) => {
                      e.currentTarget.src = "/avatar.png";
                    }}
                  />
                  {onlineUsers.some((u) => u.userId === user._id) && (
                    <div className="absolute bottom-0 right-0 bg-green-500 rounded-full ring-2 ring-base-100 size-3"></div>
                  )}
                </div>

                {/* User Info (hidden on mobile) */}
                <div className="hidden lg:block text-left min-w-0">
                  <div className="font-medium truncate">{user.username}</div>
                </div>
              </button>
            ))
          ) : (
            <div className="text-center text-zinc-500 py-4">No users found</div>
          )}
        </div>
      </aside>
    </>
  );
};
export default UsersSideBar;
