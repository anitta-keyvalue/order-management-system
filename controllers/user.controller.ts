import HttpException from "../exceptions/httpException";
import EmployeeService from "../services/user.service";
import { Request, Response, Router, NextFunction } from "express";
import { isEmail } from "../validators/validator";
import { plainToInstance } from "class-transformer";
import { CreateUserDto } from "../dto/create-user.dto";
import { validate } from "class-validator";
import User from "../entities/user.entity";
import UserService from "../services/user.service";

class UserController {
  constructor(private userService: UserService, router: Router) {
    router.get("/", this.getAllUsers.bind(this));
    router.get("/:id", this.getUserById.bind(this));
    router.post("/", this.createUser.bind(this));
    router.put("/:id", this.updateUser.bind(this));
    router.delete("/:id", this.deleteUser.bind(this));
  }

  async getAllUsers(req: Request, res: Response) {
    const employees = await this.userService.getAllUsers();
    res.status(200).send(employees);
  }

  async getUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const employee = await this.userService.getUserById(
        Number(req.params.id)
      );
      if (!employee) {
        throw new HttpException(404, "User not found ");
      }
      res.status(200).send(employee);
    } catch (err) {
      //   res.status(400).send("Employee not found 1243");
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
      const employee = await this.userService.createUser(
        createUserDto.email,
        createUserDto.name,
        createUserDto.password
      );
      res.status(201).send(employee);
    } catch (err) {
      //   console.log(err);
      next(err);
    }
  }

  async updateUser(req: Request, res: Response) {
    const employee = await this.userService.updateUser(
      Number(req.params.id),
      req.body.name,
      req.body.email
    );
    res.status(200).send(employee);
  }

  async deleteUser(req: Request, res: Response) {
    await this.userService.deleteUser(Number(req.params.id));
    res.status(204).send("User deleted successfully");
  }

  emptyFunction = (test: string) => {};
}

export default UserController;
