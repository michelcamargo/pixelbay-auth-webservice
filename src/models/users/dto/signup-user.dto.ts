import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class SignUpUserDto {
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @IsString()
  @MinLength(6)
  readonly secret: string;

  @IsString()
  @IsNotEmpty()
  readonly fullname: string;

  @IsOptional()
  readonly profileId?: number;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @MinLength(6)
  readonly alias?: string;

  @IsDate()
  @IsOptional()
  readonly birthdate?: Date;

  @IsString()
  @MinLength(5)
  @IsOptional()
  readonly firstname?: string;

  @IsString()
  @MinLength(5)
  @IsOptional()
  readonly lastname?: string;

  @IsString()
  @MinLength(8)
  @IsOptional()
  readonly phone?: string;

  @IsString()
  @MinLength(5)
  @IsOptional()
  readonly businessName?: string;

  @IsString()
  @IsOptional()
  readonly description?: string;

  @IsString()
  @IsOptional()
  readonly notes?: string;

  @IsString()
  @IsOptional()
  readonly lastAddress?: string;
}
