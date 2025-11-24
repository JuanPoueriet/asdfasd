import { IsBoolean, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class EnableMfaDto {
  @IsString()
  @IsNotEmpty()
  @Length(6, 6, { message: 'El código TOTP debe tener 6 dígitos.' })
  mfaCode: string;
}

export class VerifyMfaLoginDto {
  @IsString()
  @IsNotEmpty()
  mfaToken: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 10, { message: 'El código debe tener entre 6 y 10 caracteres.' }) // 6 para TOTP, 10 para recovery
  mfaCode: string;

  @IsBoolean()
  @IsOptional()
  rememberMe?: boolean = false;
}

export class DisableMfaDto {
  @IsString()
  @IsNotEmpty()
  @Length(6, 10, { message: 'Se requiere la contraseña o un código de recuperación.' })
  passwordOrRecoveryCode: string;
}