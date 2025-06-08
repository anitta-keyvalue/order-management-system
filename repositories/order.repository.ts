import { Repository } from "typeorm";
import Order from "../entities/order.entity";

class OrderRepository {
  constructor(private repository: Repository<Order>) {
  }

  async create(order: Order): Promise<Order> {
    return this.repository.save(order);
  }

  async findAll(): Promise<Order[]> {
    return this.repository.find({
      relations: ["items"]
    });
  }

  async findByUserId(userId: number): Promise<Order[]> {
    return this.repository.find({ 
      where: { userId },
      relations: ["items"]
    });
  }

  async findByOrderId(orderId: number): Promise<Order> {
    return this.repository.findOne({ 
      where: { id: orderId },
      relations: ["items"]
    });
  }

  async update(order: Order): Promise<Order> {
    return this.repository.save(order);
  }

  async delete(orderId: number): Promise<void> {
    await this.repository.delete(orderId);
  }
}

export default OrderRepository;