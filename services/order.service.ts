import { CreateOrderItemDto } from "../dto/create-order.dto";
import Order from "../entities/order.entity";
import OrderRepository from "../repositories/order.repository";
import ProductRepository from "../repositories/product.repository";
import HttpException from "../exceptions/httpException";
import OrderItem from "../entities/order_item.entity";
import Product from "../entities/product.entity";
import { dataSource } from "../db/data-source";
import QueueService, { QueueMessage } from "./queue.service";
import { v4 as uuidv4 } from 'uuid';

class OrderService {
  private queueService: QueueService;

  constructor(
    private orderRepository: OrderRepository,
    private productRepository: ProductRepository
  ) {
    this.queueService = new QueueService();
  }

  async createOrder(
    userId: number,
    addressId: number,
    items: CreateOrderItemDto[]
  ): Promise<Order> {
    const order = new Order();
    let totalPrice = 0;
    const orderItems: OrderItem[] = [];
    order.userId = userId;

    // Start transaction
    const queryRunner = dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      for (const item of items) {
        const product = await queryRunner.manager.findOne(Product, {
          where: { id: item.productId }
        });
        
        if (!product) {
          throw new HttpException(404, "Product not found");
        }
        
        if (product.stock < item.quantity) {
          throw new HttpException(400, "Product quantity is not enough");
        }

        product.stock -= item.quantity;
        await queryRunner.manager.save(product);

        const orderItem = new OrderItem();
        orderItem.productId = product.id;
        orderItem.quantity = item.quantity;
        orderItem.price = product.price;
        orderItems.push(orderItem);
        totalPrice += product.price * item.quantity;
      }

      order.orderAddressId = addressId;
      order.items = orderItems;
      order.status = "SUCCESS"; 
      order.totalPrice = totalPrice;

      await queryRunner.manager.save(order);
      await queryRunner.commitTransaction();

      // Publish order created message to queue
      await this.publishOrderCreatedEvent(order);
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
    return order;
  }

  async findByUserId(userId: number): Promise<Order[]> {
    return this.orderRepository.findByUserId(userId);
  }


  async findByOrderId(orderId: number): Promise<Order> {
    const order = await this.orderRepository.findByOrderId(orderId);
    if (!order) {
      throw new HttpException(404, "Order not found");
    }
    return order;
  }

  async update(orderId: number, status: string): Promise<Order> {
    const order = await this.orderRepository.findByOrderId(orderId);
    if (!order) {
      throw new HttpException(404, "Order not found");
    }
    order.status = status;
    return this.orderRepository.update(order);
  }

  async delete(orderId: number): Promise<void> {
    const order = await this.orderRepository.findByOrderId(orderId);
    if (!order) {
      throw new HttpException(404, "Order not found");
    }
    await this.orderRepository.delete(order.id);
  }

  private async publishOrderCreatedEvent(order: Order): Promise<void> {
    try {
      const message: QueueMessage = {
        id: uuidv4(),
        type: 'ORDER_CREATED',
        data: {
          orderId: order.id,
          userId: order.userId,
          orderDetails: order
        },
        timestamp: Date.now()
      };

      await this.queueService.publishMessage('order-events', message);
      console.log(`Order created event published for order ${order.id}`);
    } catch (error) {
      console.error(`Failed to publish order created event for order ${order.id}:`, error);
      // Don't throw error here to avoid breaking the order creation process
    }
  }
}

export default OrderService;
