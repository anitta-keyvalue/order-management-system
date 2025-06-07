import { Between, Repository } from "typeorm";
import Product from "../entities/product.entity";

class ProductRepository {
  constructor(private repository: Repository<Product>) {
  }

  async findAll(): Promise<Product[]> {
    return this.repository.find();
  }

  async findOneById(id: number): Promise<Product | null> {
    return this.repository.findOne({ where: { id } });
  }
  async findByPriceRange(minPrice: number, maxPrice: number): Promise<Product[]> {
    return this.repository.find({
      where: {
        price: Between(minPrice, maxPrice)
      }
    });
  }
}

export default ProductRepository;