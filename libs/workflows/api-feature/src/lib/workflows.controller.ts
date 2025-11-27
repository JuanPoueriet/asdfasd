
import {
  Controller,
  Post,
  Param,
  Body,
  UseGuards,
  ParseUUIDPipe,
  Delete,
  Get,
  Patch,
} from '@nestjs/common';
import { WorkflowsService } from './workflows.service';
import { JwtAuthGuard, CurrentUser, HasPermission } from '@univeex/auth/feature-api';
import { User } from '@univeex/users/api-data-access';
import { PERMISSIONS } from '@univeex/shared/util-common';
import { CreateApprovalPolicyDto, UpdateApprovalPolicyDto } from './dto/approval-policy.dto';

@Controller('workflows')
@UseGuards(JwtAuthGuard)
export class WorkflowsController {
  constructor(private readonly workflowsService: WorkflowsService) {}

  @Post('approve/:requestId')
  approve(
    @Param('requestId', ParseUUIDPipe) requestId: string,
    @CurrentUser() user: User,
  ) {
    const userRoles = user.roles.map((r) => r.id);
    return this.workflowsService.approve(requestId, user.id, userRoles);
  }

  @Post('reject/:requestId')
  reject(
    @Param('requestId', ParseUUIDPipe) requestId: string,
    @Body('reason') reason: string,
  ) {
    return this.workflowsService.reject(requestId, reason);
  }


  @Post('policies')
  @HasPermission(PERMISSIONS.WORKFLOWS_MANAGE)
  createPolicy(
    @Body() dto: CreateApprovalPolicyDto,
    @CurrentUser() user: User,
  ) {
    return this.workflowsService.createPolicy(dto, user.organizationId);
  }

  @Get('policies')
  @HasPermission(PERMISSIONS.WORKFLOWS_MANAGE)
  getPolicies(@CurrentUser() user: User) {
    return this.workflowsService.getPolicies(user.organizationId);
  }

  @Patch('policies/:policyId')
  @HasPermission(PERMISSIONS.WORKFLOWS_MANAGE)
  updatePolicy(
    @Param('policyId', ParseUUIDPipe) policyId: string,
    @Body() dto: UpdateApprovalPolicyDto,
    @CurrentUser() user: User,
  ) {
    return this.workflowsService.updatePolicy(
      policyId,
      dto,
      user.organizationId,
    );
  }

  @Delete('policies/:policyId')
  @HasPermission(PERMISSIONS.WORKFLOWS_MANAGE)
  deletePolicy(
    @Param('policyId', ParseUUIDPipe) policyId: string,
    @CurrentUser() user: User,
  ) {
    return this.workflowsService.deletePolicy(policyId, user.organizationId);
  }
}