import { Type } from "class-transformer";
import { IsArray, IsNotEmpty, IsNumber, Min, ValidateNested } from "class-validator";

export class CreateOrderDto {

  @IsNotEmpty()
  @IsNumber()
  addressId: number;

  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];
}

export class CreateOrderItemDto {
  @IsNotEmpty()
  @IsNumber()
  productId: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  quantity: number;
}