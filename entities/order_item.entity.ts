import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import AbstractEntity from "./abstract.entity";
import Product from "./product.entity";
import Order from "./order.entity";

@Entity()
class OrderItem extends AbstractEntity {
  @OneToOne(() => Order, (order) => order.id)
  @JoinColumn({ name: "order_id" })
  @Column()
  orderId: number;

  @Column()
  @OneToOne(() => Product, (product) => product.id)
  @JoinColumn({ name: "product_id" })
  productId: number;

  @Column()
  quantity: number;

  @Column()
  price: number;
}

export default OrderItem;