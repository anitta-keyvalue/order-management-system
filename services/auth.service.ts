import { JwtPayload } from "jsonwebtoken";
import HttpException from "../exceptions/httpException";
import { JWT_TOKEN, JWT_VALIDITY } from "../utils/constants";
import UserService from "./user.service";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

class AuthService {
  constructor(private userService: UserService) {}

  async login(email: string, password: string) {
    
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new HttpException(401, "Invalid email or password");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new HttpException(401, "Invalid email or password");
    }
    const payload: JwtPayload = {
      email: user.email,
      id: user.id,
    };
    const token = jwt.sign(payload, JWT_TOKEN, { expiresIn: JWT_VALIDITY });
    return  {
        tokenType: "Bearer",
        accessToken: token,
       
    }
  }
}

export default AuthService;
