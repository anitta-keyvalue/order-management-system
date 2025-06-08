import { Request, Response, Router } from "express";
import OrderService from "../services/order.service";
import { plainToInstance } from "class-transformer";
import { CreateOrderDto } from "../dto/create-order.dto";
import { UpdateOrderDto } from "../dto/update-order.dto";

class OrderController {
  constructor(private orderService: OrderService, router: Router) {
    router.post("/:id", this.createOrder.bind(this));
    router.get("/getAll/:id", this.getOrders.bind(this));
    router.get("/:id", this.getOrder.bind(this));
    router.put("/:id", this.updateOrder.bind(this));
    router.delete("/:id", this.deleteOrder.bind(this));
  } 

  async createOrder(req: Request, res: Response) {
    const createOrderDto = plainToInstance(CreateOrderDto, req.body);
    const userId = Number(req.params.id);
    const order = await this.orderService.createOrder(userId, createOrderDto.addressId, createOrderDto.items);
    res.status(201).send(order);
  }

  async getOrders(req: Request, res: Response) {
    const orders = await this.orderService.findByUserId(Number(req.params.id));
    res.status(200).send(orders);
  }

  async getOrder(req: Request, res: Response) {
    const order = await this.orderService.findByOrderId(Number(req.params.id));
    res.status(200).send(order);
  }

  async updateOrder(req: Request, res: Response) {
    const updateOrderDto = plainToInstance(UpdateOrderDto, req.body);
    const order = await this.orderService.update(Number(req.params.id), updateOrderDto.status);
    res.status(200).send(order);
  }

  async deleteOrder(req: Request, res: Response) {
    await this.orderService.delete(Number(req.params.id));
    res.status(204).send();
  }
}

export default OrderController;