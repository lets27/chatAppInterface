import { LogOut, MessageSquare, Settings, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import useUserContext from "../context/useUser";
import toast from "react-hot-toast";
import { useSocket } from "../context/useSocket";

const Navbar = () => {
  const { user, loading } = useUserContext();
  const navigate = useNavigate();
  const { setUser } = useUserContext();
  const { disconnectSocket } = useSocket();
  const { socket } = useSocket();
  const logout = async () => {
    try {
      localStorage.removeItem("chatToke");
      disconnectSocket();

      // Wait for disconnection confirmation
      await new Promise((resolve) => {
        const checkDisconnect = () => {
          if (!socket || !socket.connected) {
            resolve(true);
          } else {
            setTimeout(checkDisconnect, 50);
          }
        };
        checkDisconnect();
      });

      setUser(null);
      navigate("/signup");
      toast.success("Log out complete. Goodbye!");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Error during logout");
    }
  };
  return (
    <header
      className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 
      backdrop-blur-lg bg-base-100/80"
    >
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-8">
            <Link
              to="/"
              className="flex items-center gap-2.5 hover:opacity-80 transition-all"
            >
              <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-primary" />
              </div>
              <h1 className="text-lg font-bold">Messenger</h1>
            </Link>
          </div>
          <h1 className="font-montserrat">{user?.username}</h1>
          <div className="flex items-center gap-2">
            <Link
              to={"/settings"}
              className={`
                btn btn-sm gap-2 transition-colors
                
                `}
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span>
            </Link>

            {user ? (
              <>
                <Link to={"/profile"} className={`btn btn-sm gap-2`}>
                  <User className="size-5" />
                  <span className="hidden sm:inline">Profile</span>
                </Link>

                <button className="flex gap-2 items-center" onClick={logout}>
                  <LogOut className="size-5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
