import { Module } from '@nestjs/common';
import { PaymentService } from './payments.service';
import { PaymentsController } from './payments.controller';

@Module({
  controllers: [PaymentsController],
  providers: [PaymentService],
})
export class PaymentsModule {}
