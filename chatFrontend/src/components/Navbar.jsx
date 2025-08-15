import { LogOut, MessageSquare, Settings, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import useUserContext from "../context/useUser";
import toast from "react-hot-toast";
import { useSocket } from "../context/useSocket";
import liveChat from "../assets/live-chat.png";

const Navbar = () => {
  const { user } = useUserContext();
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
    <header className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 backdrop-blur-lg bg-base-100/80">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-2.5 hover:opacity-80 transition-all"
        >
          <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
            <img src={liveChat} alt="Auth Image" width={36} height={36} />
          </div>
          <h1 className="text-lg font-bold">Messenger</h1>
        </Link>

        {/* Username */}
        <h1 className="font-montserrat hidden sm:block">{user?.username}</h1>

        {/* Buttons: Only settings hidden on small screens */}
        <div className="flex items-center gap-2">
          <Link
            to={"/settings"}
            className="btn btn-sm gap-2 hidden sm:flex transition-colors"
          >
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </Link>

          {user && (
            <>
              <Link to={"/profile"} className="btn btn-sm gap-2">
                <User className="size-5" />
                <span className="hidden sm:inline">Profile</span>
              </Link>

              <button onClick={logout} className="btn btn-sm gap-2">
                <LogOut className="size-5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
export default Navbar;
