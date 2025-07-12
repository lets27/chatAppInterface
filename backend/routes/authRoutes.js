import { Router } from "express";
import { login, signUp, upload } from "../controllers/authControllers.js";

const authRouter = Router();
authRouter.post("/signup", upload.single("file"), signUp);
authRouter.post("/login", login);

export default authRouter;
