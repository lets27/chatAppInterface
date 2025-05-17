import { useSelectedUser } from "../../context/useSelectedUser";
import ChatContainer from "../../components/chatContainer";
import UsersSideBar from "../../components/sideBar";
import ChatPlaceHolder from "../../components/chatPlaceHolder";
import useUserContext from "../../context/useUser";

const HomePage = () => {
  const { loading, user } = useUserContext();
  const { selectedUser } = useSelectedUser();
  console.log("user in home page:", user);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-base-200">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-screen bg-base-200">
      <div className="flex items-centered justify-center pt-20 px-4">
        <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]">
          <div className="flex h-full rounded-lg overflow-hidden">
            <UsersSideBar />
            {selectedUser ? <ChatContainer /> : <ChatPlaceHolder />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
