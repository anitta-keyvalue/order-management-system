import User from "../entities/user.entity";
import { Repository } from "typeorm";

class UserRepository {
  constructor(private repository: Repository<User>) {
  }

  async create(user: User): Promise<User>{
    return this.repository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.repository.find({
      relations:{
        addresses: true,
      },
    });
  }

  async findOneById(id: number): Promise<User | null> {
    return this.repository.findOne({ 
      where: {id},
      relations:{
        addresses: true,
      },
     });
  }

  async update(id: number, user: User): Promise<User> {
    return this.repository.save({ ...user, id });
  }

  async delete(user: User): Promise<void> {
    await this.repository.remove(user);
  }

  async getByEmail(email: string): Promise<User | null> {
    return this.repository.findOneBy({ email });
  }
}

export default UserRepository;