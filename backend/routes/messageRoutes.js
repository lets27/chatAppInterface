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
messageRouter.use(verifyToken); // Apply token verification middleware to all routes
messageRouter.get("/user", singleUser);
messageRouter.get("/all", allUsers);
messageRouter.get("/messages/:id", getMessages);
messageRouter.post("/send/:id", upload.single("file"), sendMessages);

export default messageRouter;
