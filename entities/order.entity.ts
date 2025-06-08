import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from "typeorm";
import AbstractEntity from "./abstract.entity";
import OrderAddress from "./order_address.entity";
import User from "./user.entity";
import OrderItem from "./order_item.entity";
import Address from "./address.entity";

@Entity()
class Order extends AbstractEntity {
  @OneToOne(() => User, (user) => user.id)
  @JoinColumn({ name: "user_id" })
  @Column()
  userId: number;

  @OneToOne(() => Address, (address) => address.id)
  @JoinColumn({ name: "order_address_id" })
  @Column()
  orderAddressId: number;

  @Column()
  status: string;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.orderId, { cascade: true })
  items: OrderItem[];

  @Column()
  totalPrice: number;
}

export default Order;