import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import AbstractEntity from "./abstract.entity";
import Product from "./product.entity";

@Entity()
class CartItem extends AbstractEntity {
  @Column()
  cartId: number;

  @Column()
  @OneToOne(() => Product, (product) => product.id)
  @JoinColumn({ name: "product_id" })
  productId: number;

  @Column()
  quantity: number;
}

export default CartItem;