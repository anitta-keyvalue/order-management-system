import { Request, Response, Router } from "express";
import ProductService from "../services/product.service";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { FilterProductsDto } from "../dto/filter-products.dto";
import HttpException from "../exceptions/httpException";

class ProductController {
  constructor(private productService: ProductService, router: Router) {
    router.get("/", this.findAll.bind(this));
    router.get("/:id", this.findOneById.bind(this));
    router.post("/filter", this.findByPriceRange.bind(this));
  }

  async findAll(req: Request, res: Response) {
    const products = await this.productService.findAll();
    res.status(200).send(products);
  }

  async findOneById(req: Request, res: Response) {
    const product = await this.productService.findOneById(
      Number(req.params["id"])
    );
    res.status(200).send(product);
  }

  async findByPriceRange(req: Request, res: Response) {
    try {
      const filterProductsDto = plainToInstance(FilterProductsDto, req.body);
      const errors = await validate(filterProductsDto);
      if (errors.length > 0) {
        const formattedErrors = errors.map((error) => ({
          property: error.property,
          constraints: error.constraints,
          value: error.value,
        }));
        throw new HttpException(400, JSON.stringify({
          message: "Validation failed",
          errors: formattedErrors,
        }));
      }

      const products = await this.productService.findByPriceRange(
        filterProductsDto.minPrice,
        filterProductsDto.maxPrice
      );
      res.status(200).send(products);
    } catch (error) {
      if (error instanceof HttpException) {
        res.status(error.status).json(JSON.parse(error.message));
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  }
}

export default ProductController;

