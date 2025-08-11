import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import AbstractEntity from "./abstract.entity";
import Product from "./product.entity";
import Order from "./order.entity";

@Entity()
class OrderItem extends AbstractEntity {
  @ManyToOne(() => Order, (order) => order.id)
  @JoinColumn({ name: "order_id" })
  @Column()
  orderId: number;

  @ManyToOne(() => Product)
  @JoinColumn({ name: "product_id" })
  product: Product;

  @Column()
  productId: number;

  @Column()
  quantity: number;

  @Column()
  price: number;
}

export default OrderItem;