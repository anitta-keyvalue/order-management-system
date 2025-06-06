import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
import AbstractEntity from "./abstract.entity";
import User from "./user.entity";

@Entity()
class Cart extends AbstractEntity {

  @Column()
  @OneToOne(() => User, (user) => user.id)
  @JoinColumn({ name: "user_id" })
  userId: number;
}

export default Cart;