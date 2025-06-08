import { Request, Response, Router } from "express";
import CartService from "../services/cart.service";
import { AddToCartDto } from "../dto/add-to-cart.dto";
import { plainToInstance } from "class-transformer";
import { RemoveFromCartDto } from "../dto/remove-from-cart.dto";

class CartController {
  constructor(private cartService: CartService, router: Router) {
    router.post("/add/:id", this.addToCart.bind(this));
    router.get("/:id", this.getCart.bind(this));
    router.delete("/:id", this.removeFromCart.bind(this));
    router.delete("/clear/:id", this.clearCart.bind(this));
    router.put("/:id", this.updateCartItem.bind(this));
  }

  async addToCart(req: Request, res: Response) {
    const addToCartDto = plainToInstance(AddToCartDto, req.body);
    const userId = Number(req.params.id);
    const cart = await this.cartService.addToCart(
      addToCartDto.productId,
      userId,
      addToCartDto.quantity
    );
    res.status(200).send(cart);
  }

  async getCart(req: Request, res: Response) {
    const userId = Number(req.params.id);
    const cart = await this.cartService.getCart(userId);
    res.status(200).send(cart);
  }

  async removeFromCart(req: Request, res: Response) {
    const removeFromCartDto = plainToInstance(RemoveFromCartDto, req.body);
    const userId = Number(req.params.id);
    await this.cartService.removeFromCart(removeFromCartDto.productId, userId);
    res.status(200).send();
  }

  async clearCart(req: Request, res: Response) {
    const userId = Number(req.params.id);
    await this.cartService.clearCart(userId);
    res.status(200).send();
  }

  async updateCartItem(req: Request, res: Response) {
    const updateCartItemDto = plainToInstance(AddToCartDto, req.body);
    const userId = Number(req.params.id);
    await this.cartService.updateCartItem(
      updateCartItemDto.productId,
      userId,
      updateCartItemDto.quantity
    );
    res.status(200).send();
  }
}

export default CartController;
