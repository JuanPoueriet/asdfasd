
import { Account } from '@univeex/chart-of-accounts/feature-api';
import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsOptional,
  IsEnum,
  IsUUID,
  IsBoolean,
  ValidateNested,
  IsObject,
  IsArray,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  AccountType,
  AccountCategory,
  AccountNature,
  CashFlowCategory,
  RequiredDimension,
} from '@univeex/chart-of-accounts/feature-api';
import { CreateAccountDto } from '@univeex/chart-of-accounts/feature-api';

export class AccountTemplateDto {
  @IsString() @IsNotEmpty() @MaxLength(50) code: string;
  @IsString() @IsNotEmpty() @MaxLength(255) name: string;
  @IsEnum(AccountType) @IsNotEmpty() type: AccountType;
  @IsEnum(AccountCategory) @IsNotEmpty() category: AccountCategory;
  @IsEnum(AccountNature) @IsNotEmpty() nature: AccountNature;
  @IsBoolean() @IsOptional() isPostable?: boolean = true;
  @IsBoolean() @IsOptional() isMultiCurrency?: boolean = false;

  @IsOptional()
  children?: AccountTemplateDto[];
}
