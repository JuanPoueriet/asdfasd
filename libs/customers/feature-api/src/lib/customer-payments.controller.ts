import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { CustomerPaymentsService } from './customer-payments.service';
import { CreateCustomerPaymentDto } from './dto/create-customer-payment.dto';
import { JwtAuthGuard } from '@univeex/auth/feature-api';
import { CurrentUser } from '@univeex/auth/feature-api';
import { User } from '@univeex/users/api-data-access';

@Controller('customer-payments')
@UseGuards(JwtAuthGuard)
export class CustomerPaymentsController {
  constructor(
    private readonly customerPaymentsService: CustomerPaymentsService,
  ) {}

  @Post()
  create(@Body() createCustomerPaymentDto: CreateCustomerPaymentDto, @CurrentUser() user: User) {
    return this.customerPaymentsService.create(createCustomerPaymentDto, user.organizationId);
  }
}