import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreatePaymentDto {
  @IsArray()
  @IsNotEmpty()
  cartItems: CartItemDto[]; // Definimos el array de items del carrito
}

// Definimos un DTO para cada item del carrito
export class CartItemDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  name: string; // Nombre del producto

  @IsNumber()
  @IsNotEmpty()
  price: number; // Precio unitario del producto

  @IsNumber()
  @IsNotEmpty()
  quantity: number; // Cantidad del producto
}
