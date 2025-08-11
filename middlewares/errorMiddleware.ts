import { Request, Response, Router, NextFunction } from "express";
import HttpException from "../exceptions/httpException";
const errorMiddleware = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // console.log(error);
    // res.status(500).send("Internal server error");
    if (error instanceof HttpException) {
      console.log("error is instance of HttpException", error);
      const status = error.status || 500;
      const message = error.message || "Something went wrong";
      let resBody = {message: message};
      res.status(status).json(resBody);
    } else {
      console.error(error.stack);
      res.status(500).send({error: error.message});
    }
  } catch (err) {
    next(err);
  }
};

export default errorMiddleware;
