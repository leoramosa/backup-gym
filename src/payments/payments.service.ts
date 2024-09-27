import { Injectable } from '@nestjs/common';
import { MercadoPagoConfig, Preference } from 'mercadopago';

@Injectable()
export class PaymentService {
  private mercadoPagoClient: MercadoPagoConfig;

  constructor() {
    // Crear una instancia de MercadoPagoConfig con el access token desde las variables de entorno
    this.mercadoPagoClient = new MercadoPagoConfig({
      accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN,
    });
  }

  async createPayment(cartItems: any[]) {
    // Mapear los items del carrito a la estructura que Mercado Pago necesita
    const items = cartItems.map((item) => ({
      id: item.id,
      title: item.name,
      unit_price: item.price,
      quantity: item.quantity,
      currency_id: 'ARS', // Puedes hacer esto dinámico si es necesario
    }));

    // Crear la preferencia de pago con los items del carrito y las URLs de retorno dinámicas
    const preference = new Preference(this.mercadoPagoClient);
    const body = {
      items: items,
      back_urls: {
        success: `${process.env.FRONTEND_URL}/success`,
        failure: `${process.env.FRONTEND_URL}/failure`,
        pending: `${process.env.FRONTEND_URL}/pending`,
      },
      auto_return: 'approved',
    };

    try {
      // Crear la preferencia de pago en Mercado Pago
      const result = await preference.create({ body });
      return result; // Retornar el ID de la preferencia creada
    } catch (error) {
      // Manejo de errores en caso de fallo
      throw new Error('Error al crear el pago con Mercado Pago');
    }
  }
}
