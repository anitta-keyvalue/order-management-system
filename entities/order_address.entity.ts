import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import AbstractEntity from "./abstract.entity";
import Order from "./order.entity";
import Address from "./address.entity";

@Entity()
class OrderAddress extends AbstractEntity {
  @OneToOne(() => Order, (order) => order.id)
  @JoinColumn({ name: "order_id" })
  @Column()
  orderId: number;

  @Column()
  line1: string;

  @Column()
  pincode: string;


  // For the time being assuming addresses will not be edited
  @OneToOne(() => Address, (address) => address.id)
  @JoinColumn({ name: "address_id" })
  @Column()
  addressId: number;
}

export default OrderAddress;