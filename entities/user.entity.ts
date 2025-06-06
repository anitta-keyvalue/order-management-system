import { Column, Entity, JoinColumn, OneToMany } from "typeorm";
import AbstractEntity from "./abstract.entity";
import Address from "./address.entity";

@Entity()
class User extends AbstractEntity {
  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  phone: string;

  @OneToMany(() => Address, (address) => address.userId)
  @JoinColumn({ name: "addresses" })
  addresses: Address[];
}

export default User;
