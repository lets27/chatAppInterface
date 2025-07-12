import { Router } from "express";
import {
  login,
  signUp,
  upload,
  singleUser,
} from "../controllers/authControllers.js";
import { verifyToken } from "../controllers/utils.js";

const authRouter = Router();
authRouter.post("/signup", upload.single("file"), signUp);
authRouter.post("/login", login);

export default authRouter;
