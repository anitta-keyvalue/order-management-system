import { Router } from "express";
import AddressController from "../controllers/address.controller";
import AddressService from "../services/address.service";
import AddressRepository from "../repositories/address.repository";
import Address from "../entities/address.entity";
import { dataSource } from "../db/data-source";

const addressRouter = Router();

const addressRepository = new AddressRepository(dataSource.getRepository(Address));
const addressService = new AddressService(addressRepository);
new AddressController(addressService, addressRouter);

export default addressRouter;