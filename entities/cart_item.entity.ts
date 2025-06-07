import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import AbstractEntity from "./abstract.entity";
import Product from "./product.entity";
import Cart from "./cart.entity";

@Entity()
class CartItem extends AbstractEntity {
  @Column()
  @ManyToOne(() => Cart, (cart) => cart.id)
  @JoinColumn({ name: "cart_id" })
  cartId: number;

  @Column()
  @ManyToOne(() => Product, (product) => product.id)
  @JoinColumn({ name: "product_id" })
  productId: number;

  @Column()
  quantity: number;
}

export default CartItem;