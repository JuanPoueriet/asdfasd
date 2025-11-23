import { IsEnum, IsBoolean, IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';
import { SsoProviderType } from '../sso-config.entity';

export class CreateSsoConfigDto {
  @IsEnum(SsoProviderType)
  provider: SsoProviderType = SsoProviderType.SAML;

  @IsUrl()
  @IsNotEmpty()
  issuerUrl: string;

  @IsUrl()
  @IsNotEmpty()
  entryPointUrl: string;

  @IsString()
  @IsNotEmpty()
  certificate: string;

  @IsString()
  @IsOptional()
  identifierFormat?: string;
}

export class UpdateSsoConfigDto {
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
  
  @IsUrl()
  @IsOptional()
  issuerUrl?: string;

  @IsUrl()
  @IsOptional()
  entryPointUrl?: string;

  @IsString()
  @IsOptional()
  certificate?: string;
  
  @IsString()
  @IsOptional()
  identifierFormat?: string;
}