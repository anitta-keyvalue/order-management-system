import { Repository } from "typeorm";
import Order from "../entities/order.entity";

class OrderRepository {
  constructor(private repository: Repository<Order>) {
  }

  async create(order: Order): Promise<Order> {
    return this.repository.save(order);
  }

  async findAll(): Promise<Order[]> {
    return this.repository.find();
  }
}

export default OrderRepository;