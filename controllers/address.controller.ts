import { Request, Response, Router, NextFunction } from "express";
import AddressService from "../services/address.service";
import authMiddleware from "../middlewares/auth.middleware";

class AddressController {
  constructor(private addressService: AddressService, router: Router) {
    router.post("/", authMiddleware, this.createAddress.bind(this));
    router.get("/:id", authMiddleware, this.getAddress.bind(this));
    router.put("/:id", authMiddleware, this.updateAddress.bind(this));
    router.delete("/:id", authMiddleware, this.deleteAddress.bind(this));
  }

  async createAddress(req: Request, res: Response) {
    const address = await this.addressService.createAddress(req.body);
    res.status(201).send(address);
  }

  async getAddress(req: Request, res: Response) {
    const address = await this.addressService.findOneById(Number(req.params["id"]));
    res.status(200).send(address);
  }

  async updateAddress(req: Request, res: Response) {
    const address = await this.addressService.update(Number(req.params["id"]), req.body);
    res.status(200).send(address);
  }

  async deleteAddress(req: Request, res: Response) {
    await this.addressService.delete(Number(req.params["id"]));
    res.status(204).send();
  }
}

export default AddressController;