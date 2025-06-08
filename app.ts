import express from "express";
import loggerMiddleware from "./middlewares/loggerMiddleware";
import authRouter from "./routes/auth.routes";
import errorMiddleware from "./middlewares/errorMiddleware";
import { dataSource } from "./db/data-source";
import userRouter from "./routes/user.routes";
import addressRouter from "./routes/address.route";
import productRouter from "./routes/product.route";
import cartRouter from "./routes/cart.route";
import orderRouter from "./routes/order.route";

const server = express();
server.use(express.json());
server.use(loggerMiddleware);

server.use("/auth", authRouter);
server.use("/user", userRouter);
server.use("/address", addressRouter);
server.use("/product", productRouter);
server.use("/cart", cartRouter);
server.use("/order", orderRouter);
server.use(errorMiddleware);

(async () => {
  try {
    await dataSource.initialize();
    console.log("Connected to the database");
  } catch (error) {
    console.log("Error connecting to the database", error);
    process.exit(1);
  }
  server.listen(3000, () => {
    console.log("server listening to 3000");
  });
})();
