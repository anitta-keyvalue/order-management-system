import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import AbstractEntity from "./abstract.entity";
import OrderAddress from "./order_address.entity";
import User from "./user.entity";

@Entity()
class Order extends AbstractEntity {
  @OneToOne(() => User, (user) => user.id)
  @JoinColumn({ name: "user_id" })
  @Column()
  userId: number;

  @OneToOne(() => OrderAddress, (orderAddress) => orderAddress.orderId)
  @JoinColumn({ name: "order_address_id" })
  @Column()
  orderAddressId: number;

}

export default Order;