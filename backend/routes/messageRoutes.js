import { Router } from "express";
import { verifyToken } from "../controllers/utils.js";
import {
  allUsers,
  sendMessages,
  upload,
  getMessages,
} from "../controllers/MessageControllers.js";
import { singleUser } from "../controllers/authControllers.js";

const messageRouter = Router();
messageRouter.get("/user", singleUser); // Static route first
messageRouter.get("/all", allUsers); // Changed from "/" to "/all"
messageRouter.get("/messages/:id", getMessages); // Added "messages" prefix
messageRouter.post("/send/:id", upload.single("file"), sendMessages); // Added "send" prefix

export default messageRouter;
