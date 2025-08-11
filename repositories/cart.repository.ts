import { Repository } from "typeorm";
import Cart from "../entities/cart.entity";
import CartItem from "../entities/cart_item.entity";
import Product from "../entities/product.entity";
import HttpException from "../exceptions/httpException";

class CartRepository {
  constructor(
    private cartRepository: Repository<Cart>,
    private cartItemRepository: Repository<CartItem>,
    private productRepository: Repository<Product>
  ) {}
  
  async addToCart(
    productId: number,
    userId: number,
    quantity: number
  ): Promise<Cart> {
    const cart = await this.cartRepository.findOne({ where: { userId } });
    console.log("PRODUCT ID: ", productId);
    console.log("USER ID: ", userId);
    console.log("QUANTITY: ", quantity);
    if (!cart) {
      const newCart = new Cart();
      newCart.userId = userId;
      await this.cartRepository.save(newCart);
     // return this.addToCart(productId, userId, quantity); // Retry with the newly created cart
    }

    const product = await this.productRepository.findOne({ where: { id: productId } });
    if (!product) {
      throw new HttpException(404, "Product not found");
    }
    if (product.stock < quantity) {
      throw new HttpException(400, "Product stock is not enough");
    }

    const cartItem = await this.cartItemRepository.findOne({ where: { productId: productId, cartId: cart.id } });
    if (cartItem) {
      cartItem.quantity += quantity;
      await this.cartItemRepository.save(cartItem);
    } else {
      const newCartItem = new CartItem();
      newCartItem.cartId = cart.id;
      newCartItem.productId = productId;
      newCartItem.quantity = quantity;
      await this.cartItemRepository.save(newCartItem);
    }
    return cart;
  }

  async getCart(userId: number): Promise<Cart> {
    const cart = await this.cartRepository.findOne({ 
      where: { userId },
      relations: ["items"]
    });
    if (!cart) {
      throw new HttpException(404, "Cart not found");
    }
    return cart;
  }

  async removeFromCart(productId: number, userId: number): Promise<void> {
    const cart = await this.cartRepository.findOne({ where: { userId } });
    if (!cart) {
      throw new HttpException(404, "Cart not found");
    }
    await this.cartItemRepository.delete({ productId, cartId: cart.id });
  }

  async clearCart(userId: number): Promise<void> {
    const cart = await this.cartRepository.findOne({ where: { userId } });
    if (!cart) {
      throw new HttpException(404, "Cart not found");
    }
    await this.cartItemRepository.delete({ cartId: cart.id });
  }

  async updateCartItem(productId: number, userId: number, quantity: number): Promise<void> {
    const cart = await this.cartRepository.findOne({ where: { userId } });
    const cartItem = await this.cartItemRepository.findOne({ where: { productId, cartId: cart.id } });
    if (!cart) {
      throw new HttpException(404, "Cart not found");
    }
    if (!cartItem) {
      throw new HttpException(404, "Cart item not found");
    }
    cartItem.quantity = quantity;
    await this.cartItemRepository.save(cartItem);
  }
}

export default CartRepository;
