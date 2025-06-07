import Address from "../entities/address.entity";
import AddressRepository from "../repositories/address.repository";

class AddressService {
  constructor(private addressRepository: AddressRepository) {}

  async createAddress(address: Address): Promise<Address> {
    return this.addressRepository.create(address);
  }

  async findOneById(id: number): Promise<Address | null> {
    return this.addressRepository.findOneById(id);
  }

  async update(id: number, address: Address): Promise<Address> {
    return this.addressRepository.update(id, address);
  }

  async delete(userId: number): Promise<void> {
    await this.addressRepository.delete(userId);
  }
}

export default AddressService;