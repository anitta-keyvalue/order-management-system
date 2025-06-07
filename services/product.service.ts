import Product from "../entities/product.entity";
import ProductRepository from "../repositories/product.repository";

class ProductService {
  constructor(private productRepository: ProductRepository) {}

  async findAll(): Promise<Product[]> {
    return this.productRepository.findAll();
  }

  async findOneById(id: number): Promise<Product | null> {
    return this.productRepository.findOneById(id);
  }

  async findByPriceRange(minPrice: number, maxPrice: number): Promise<Product[]> {
    return this.productRepository.findByPriceRange(minPrice, maxPrice);
  }
  
}

export default ProductService;