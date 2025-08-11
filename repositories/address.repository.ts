import { Repository } from "typeorm";
import Address from "../entities/address.entity";

class AddressRepository {
  constructor(private repository: Repository<Address>) {
  }

  async create(address: Address): Promise<Address> {
    return this.repository.save({...address});
  }

  async findOneById(id: number): Promise<Address | null> {
    return this.repository.findOne({ where: { userId: id } });
  }

  async update(id: number, address: Address): Promise<Address> {
    return this.repository.save({ ...address, id });
  }
  async delete(userId: number): Promise<void> {
    const address = await this.repository.findOne({ where: { userId } });
    if (address) {
      await this.repository.remove(address);
    }
  }
}

export default AddressRepository;