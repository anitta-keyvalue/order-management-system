import {
  IsNotEmpty,
  IsNumber,
} from "class-validator";

export class FilterProductsDto {
  @IsNotEmpty()
  @IsNumber()
  minPrice: number;
  @IsNotEmpty()
  @IsNumber()
  maxPrice: number;
}
