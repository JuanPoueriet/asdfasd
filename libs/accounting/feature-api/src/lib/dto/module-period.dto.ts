
import { IsEnum, IsNotEmpty, IsUUID } from 'class-validator';
import { ModuleSlug } from '@univeex/accounting/data-access';

export class ModulePeriodDto {
  @IsUUID()
  @IsNotEmpty()
  periodId: string;

  @IsEnum(ModuleSlug)
  @IsNotEmpty()
  module: ModuleSlug;
}