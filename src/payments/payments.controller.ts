import { Controller, Post, Body } from '@nestjs/common';
import { PaymentService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentService: PaymentService) {}

  // Endpoint para crear un pago
  @Post()
  async createPayment(@Body() createPaymentDto: CreatePaymentDto) {
    // Se espera que el DTO contenga los items del carrito
    const cartItems = createPaymentDto.cartItems; // Asegúrate de que esta propiedad esté definida en tu DTO
    const paymentPreference =
      await this.paymentService.createPayment(cartItems);

    return paymentPreference; // Devuelve la preferencia de pago creada
  }
}
