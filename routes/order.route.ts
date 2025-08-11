import { Router } from "express";
import OrderController from "../controllers/order.controller";
import OrderService from "../services/order.service";
import OrderRepository from "../repositories/order.repository";
import ProductRepository from "../repositories/product.repository";
import { dataSource } from "../db/data-source";
import Order from "../entities/order.entity";
import Product from "../entities/product.entity";

const orderRouter = Router();

const orderRepository = new OrderRepository(dataSource.getRepository(Order));
const productRepository = new ProductRepository(dataSource.getRepository(Product));
const orderService = new OrderService(orderRepository, productRepository);
new OrderController(orderService, orderRouter);
export default orderRouter;
