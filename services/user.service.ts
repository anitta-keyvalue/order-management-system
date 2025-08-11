import bcrypt from "bcrypt";
import UserRepository from "../repositories/user.repository";
import User from "../entities/user.entity";

class UserService {
  constructor(private userRepository: UserRepository) {}

  async createUser(
    email: string,
    name: string,
    password: string,
    phone: string   
  ): Promise<User> {
    const user = new User();
    user.email = email;
    user.name = name;
    user.password = await bcrypt.hash(password, 10);
    user.phone = phone;
    return this.userRepository.create(user);
  }

  async getAllUsers(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  async getUserById(id: number): Promise<User | null> {
    const user = await this.userRepository.findOneById(id);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }

  async updateUser(id: number, name: string, email: string): Promise<User> {
    const user = await this.userRepository.findOneById(id);
    if (!user) {
      throw new Error("User not found");
    }
    user.name = name;
    user.email = email;
    return this.userRepository.update(id, user);
  }

  async deleteUser(id: number): Promise<void> {
    const user = await this.userRepository.findOneById(id);
    if (!user) {
      throw new Error("User not found");
    }
    return this.userRepository.delete(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.getByEmail(email);
  }
}

export default UserService;
