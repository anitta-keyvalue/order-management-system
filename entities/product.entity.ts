import { Column, Entity, OneToMany } from "typeorm";
import AbstractEntity from "./abstract.entity";
import CartItem from "./cart_item.entity";

@Entity()
class Product extends AbstractEntity {
  @Column()
  name: string;

  @Column()
  price: number;

  @Column()
  description: string;

  @Column()
  image: string;

  @Column()
  stock: number;

  @OneToMany(() => CartItem, (cartItem) => cartItem.productId)
  cartItems: CartItem[];
}

export default Product;
