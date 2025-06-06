import { Request, Response, NextFunction } from "express";
import AuthService from "../services/auth.service";
import { Router } from "express";

class AuthController {
  constructor(private authService: AuthService, router: Router) {
    router.post("/login", this.login.bind(this));
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const data = await this.authService.login(email, password);
      res.status(200).send(data);
    } catch (err) {
      next(err);
    }
  }
}

export default AuthController;
