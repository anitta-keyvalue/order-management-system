import {
    IsNotEmpty,
    IsNumber,
  } from "class-validator";
  
  export class AddToCartDto {
    @IsNotEmpty()
    @IsNumber()
    productId: number;
    @IsNotEmpty()
    @IsNumber()
    quantity: number;
  }
  