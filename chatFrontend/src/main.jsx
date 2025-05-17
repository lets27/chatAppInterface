import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import UserContextProvider from "./context/userContextProvider.jsx";
import SocketProvider from "./context/socketConnector.jsx";
import { MessageProvider } from "./context/MessageContext.jsx";
import ThemeProvider from "./context/themeContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <UserContextProvider>
        <MessageProvider>
          <SocketProvider>
            <ThemeProvider>
              <App />
            </ThemeProvider>
          </SocketProvider>
        </MessageProvider>
      </UserContextProvider>
    </BrowserRouter>
  </StrictMode>
);
