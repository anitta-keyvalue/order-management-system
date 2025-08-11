import HttpException from "../exceptions/httpException";
import { Request, Response, Router, NextFunction } from "express";
import { plainToInstance } from "class-transformer";
import { CreateUserDto } from "../dto/create-user.dto";
import { validate } from "class-validator";
import UserService from "../services/user.service";
import authMiddleware from "../middlewares/auth.middleware";

class UserController {
  constructor(private userService: UserService, router: Router) {
    router.get("/", authMiddleware, this.getAllUsers.bind(this));
    router.get("/:id", authMiddleware, this.getUserById.bind(this));
    router.post("/signup", this.createUser.bind(this));
    router.put("/:id", authMiddleware, this.updateUser.bind(this));
    router.delete("/:id", authMiddleware, this.deleteUser.bind(this));
  }

  async getAllUsers(req: Request, res: Response) {
    const users = await this.userService.getAllUsers();
    res.status(200).send(users);
  }

  async getUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await this.userService.getUserById(Number(req.params.id));
      if (!users) {
        throw new HttpException(404, "User not found ");
      }
      res.status(200).send(users);
    } catch (err) {
      next(err);
    }
  }

  async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const createUserDto = plainToInstance(CreateUserDto, req.body);
      const errors = await validate(createUserDto);
      if (errors.length > 0) {
        const formattedErrors = errors.map((error) => ({
          property: error.property,
          constraints: error.constraints,
          value: error.value,
        }));
        throw new HttpException(
          400,
          JSON.stringify({
            message: "Validation failed",
            errors: formattedErrors,
          })
        );
      }
      const users = await this.userService.createUser(
        createUserDto.email,
        createUserDto.name,
        createUserDto.password,
        createUserDto.phone
      );
      res.status(201).send(users);
    } catch (err) {
      //   console.log(err);
      next(err);
    }
  }

  async updateUser(req: Request, res: Response) {
    const users = await this.userService.updateUser(
      Number(req.params.id),
      req.body.name,
      req.body.email
    );
    res.status(200).send(users);
  }

  async deleteUser(req: Request, res: Response) {
    await this.userService.deleteUser(Number(req.params.id));
    res.status(204).send("User deleted successfully");
  }

  emptyFunction = (test: string) => {};
}

export default UserController;
