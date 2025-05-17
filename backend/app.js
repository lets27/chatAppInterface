import express from "express";
import cors from "cors";
import "dotenv/config";
import authRouter from "./routes/authRoutes.js";
import { app, server } from "./socket/socket.js";
import messageRouter from "./routes/messageRoutes.js";
import connectDb from "./database/mongoConnector.js";
import path from "path";
const __dirname = path.resolve();
const PORT = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

//routes
app.use("/api/auth", authRouter);
app.use("/api/official", messageRouter);

app.use((req, res, next) => {
  const error = new Error("route not found");
  error.status = 404;
  next(error);
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../chatFrontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../chatFrontend", "dist", "index.html"));
  });
}

connectDb()
  .then(
    server.listen(PORT, () => {
      console.log("Server running on port:", PORT);
    })
  )
  .catch((error) => {
    console.error("Database connection failed:", error);
  });
