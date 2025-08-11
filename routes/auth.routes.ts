import AuthService from "../services/auth.service";
import AuthController from "../controllers/auth.controller";
import UserService from "../services/user.service";
import  express from "express";
import { userService } from "./user.routes";

const authRouter = express.Router();
const authService = new AuthService(userService);
new AuthController(authService, authRouter);


export default authRouter;