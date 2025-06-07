import { Router } from "express";
import ProductController from "../controllers/product.controller";
import ProductService from "../services/product.service";
import ProductRepository from "../repositories/product.repository";
import Product from "../entities/product.entity";
import { dataSource } from "../db/data-source";

const productRouter = Router();

const productRepository = new ProductRepository(dataSource.getRepository(Product));
const productService = new ProductService(productRepository);
new ProductController(productService, productRouter);

export default productRouter;