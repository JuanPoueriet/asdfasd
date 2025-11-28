
import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Param,
  Patch,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import { AccountsPayableService } from './accounts-payable.service';
import { CreateVendorBillDto } from './dto/create-vendor-bill.dto';
import { UpdateVendorBillDto } from './dto/update-vendor-bill.dto';
import { JwtAuthGuard } from '@univeex/auth/feature-api';
import { CurrentUser } from '@univeex/auth/feature-api';
import { User } from '@univeex/users/api-data-access';

@Controller('accounts-payable')
@UseGuards(JwtAuthGuard)
export class AccountsPayableController {
  constructor(
    private readonly accountsPayableService: AccountsPayableService,
  ) {}

  @Post('bills')
  createBill(
    @Body() createVendorBillDto: CreateVendorBillDto,
    @CurrentUser() user: User,
  ) {
    return this.accountsPayableService.create(
      createVendorBillDto,
      user.organizationId,
    );
  }

  @Post('bills/:id/submit-approval')
  submitForApproval(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
  ) {
    return this.accountsPayableService.submitForApproval(
      id,
      user.organizationId,
    );
  }

  @Get('bills')
  findAllBills(@CurrentUser() user: User) {
    return this.accountsPayableService.findAll(user.organizationId);
  }

  @Get('bills/:id')
  findOneBill(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
  ) {
    return this.accountsPayableService.findOne(id, user.organizationId);
  }

  @Patch('bills/:id')
  updateBill(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateVendorBillDto: UpdateVendorBillDto,
    @CurrentUser() user: User,
  ) {
    return this.accountsPayableService.update(
      id,
      updateVendorBillDto,
      user.organizationId,
    );
  }

  @Delete('bills/:id')
  removeBill(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
  ) {
    return this.accountsPayableService.remove(id, user.organizationId);
  }

  @Post('bills/:id/void')
  voidBill(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('reason') reason: string,
    @CurrentUser() user: User,
  ) {
    return this.accountsPayableService.voidBill(
      id,
      user.organizationId,
      reason,
    );
  }

  @Post('payment-batches')
  createPaymentBatch(
    @Body()
    body: {
      billIds: string[];
      paymentDate: Date;
      bankAccountId: string;
    },
    @CurrentUser() user: User,
  ) {
    return this.accountsPayableService.createPaymentBatch(
      body.billIds,
      body.paymentDate,
      body.bankAccountId,
      user.organizationId,
    );
  }
}
