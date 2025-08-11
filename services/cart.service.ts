import Cart from "../entities/cart.entity";
import CartRepository from "../repositories/cart.repository";

class CartService {
  constructor(private cartRepository: CartRepository) {}

  async addToCart(productId: number, userId: number, quantity: number): Promise<Cart> {
    return this.cartRepository.addToCart(productId, userId, quantity);
  }

  async getCart(userId: number): Promise<Cart> {
    return this.cartRepository.getCart(userId);
  }

  async removeFromCart(productId: number, userId: number): Promise<void> {
    return this.cartRepository.removeFromCart(productId, userId);
  }

  async clearCart(userId: number): Promise<void> {
    return this.cartRepository.clearCart(userId);
  }

  async updateCartItem(productId: number, userId: number, quantity: number): Promise<void> {
    return this.cartRepository.updateCartItem(productId, userId, quantity);
  }
}

export default CartService;