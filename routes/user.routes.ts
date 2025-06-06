import { Router } from "express";
import UserController from "../controllers/user.controller";
import UserService from "../services/user.service";
import UserRepository from "../repositories/user.repository";
import User from "../entities/user.entity";
import { dataSource } from "../db/data-source";

const userRouter = Router();

const userRepository = new UserRepository(dataSource.getRepository(User));
export const userService = new UserService(userRepository);
new UserController(userService, userRouter);

export default userRouter;
