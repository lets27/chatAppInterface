import { useEffect, useMemo, useState } from "react";
import { UserContext } from "./useUser";
import { baseUrl } from "../util";

const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("chatToke");
    if (!token) {
      setUser(null);
      setLoading(false);
    }
    const fetchUser = async () => {
      try {
        const fetchUser = await fetch(`${baseUrl}/api/official/user`, {
          mode: "cors",
          method: "GET",
          headers: { authorization: `Bearer ${token}` },
        });

        if (!fetchUser.ok) {
          throw new Error("something went wrong try again");
        }

        const user = await fetchUser.json();
        console.log("user returned:", user);
        setUser(user.user);
        return user;
      } catch (error) {
        //type guard to check if error is an object
        if (error instanceof Error) {
          console.log(error.message);
          setError(error.message);
        } else {
          console.log("Unexpected error", error);
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const value = useMemo(() => {
    return { loading, error, user, setUser };
  }, [loading, error, user, setUser]);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export default UserContextProvider;
