import { Column, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import AbstractEntity from "./abstract.entity";
import User from "./user.entity";

@Entity()
class  Address extends AbstractEntity {
  @Column()
  line1: string;

  @Column()
  pincode: string;

  @ManyToOne(() => User, (user) => user.addresses)
  userId: number;


}

export default Address;
