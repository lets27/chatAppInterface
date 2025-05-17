import { useState } from "react";
import { toast } from "react-hot-toast";
import useUserContext from "../context/useUser";
import { useNavigate } from "react-router-dom";
import { baseUrl } from "../util";
import { useSocket } from "../context/useSocket";

const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { setUser } = useUserContext();
  const { connectSocket, disconnectSocket } = useSocket();

  const navigate = useNavigate();

  const login = async (credentials) => {
    setLoading(true);
    setError("");
    console.log("base:", baseUrl);
    try {
      const res = await fetch(`${baseUrl}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      const data = await res.json();
      localStorage.setItem("chatToke", data.token);

      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      console.log("our user:", data.user);
      toast.success("Login successful!");
      setUser(data.user);
      connectSocket(data.user._id);
      navigate("/");
      // You can redirect or set auth context here
    } catch (err) {
      disconnectSocket();
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, login };
};

export default useLogin;
