import { Column, Entity, JoinColumn, OneToMany, OneToOne } from "typeorm";
import AbstractEntity from "./abstract.entity";
import User from "./user.entity";
import CartItem from "./cart_item.entity";

@Entity()
class Cart extends AbstractEntity {

  @Column()
  @OneToOne(() => User, (user) => user.id)
  @JoinColumn({ name: "user_id" })
  userId: number;

  @OneToMany(() => CartItem, (cartItem) => cartItem.cartId, { cascade: true })
  items: CartItem[];
}

export default Cart;