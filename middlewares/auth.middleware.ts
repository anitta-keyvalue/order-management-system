import { NextFunction, Request, Response } from "express";
import HttpException from "../exceptions/httpException";
import jwt from "jsonwebtoken";
import { JWT_TOKEN } from "../utils/constants";
import { JwtPayload } from "../dto/jwt-payload.dto";

const getToken = (req: Request): string => {
  let token = req.headers.authorization;
  console.log("token full ......: ", token);
  if (!token) {
    throw new HttpException(401, "Unauthorized");
  }
  const tokenSplits = token.split(" ");
  if (tokenSplits.length != 2) {
    throw new HttpException(401, "Invalid token");
  }
  return tokenSplits[1];
};

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  let token = getToken(req);
  if (!token) {
    throw new HttpException(401, "Unauthorized");
  }
  try {
    const payload = jwt.verify(token, JWT_TOKEN) as JwtPayload;
    console.log("payload ......: ", payload);
    req.user = payload;
  } catch (err) {
    throw new HttpException(401, "Invalid or expired token 123");
  }
  next();
};

export default authMiddleware;
