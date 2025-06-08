import { Router } from "express";
import CartController from "../controllers/cart.controller";
import CartService from "../services/cart.service";
import CartRepository from "../repositories/cart.repository";
import Cart from "../entities/cart.entity";
import { dataSource } from "../db/data-source";
import Product from "../entities/product.entity";
import CartItem from "../entities/cart_item.entity";

const cartRouter = Router();

const cartRepository = new CartRepository(dataSource.getRepository(Cart), dataSource.getRepository(CartItem), dataSource.getRepository(Product));
const cartService = new CartService(cartRepository);
new CartController(cartService, cartRouter);

export default cartRouter;