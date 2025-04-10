import {
  IsUUID,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  IsDateString,
  MaxLength,
  IsPhoneNumber,
} from 'class-validator';

export class CreateCustomerDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsEmail()
  @IsNotEmpty()
  @MaxLength(255)
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(255)
  readonly fullname: string;

  @IsDateString()
  @IsOptional()
  readonly birthdate?: Date;

  @IsString()
  @MinLength(2)
  @MaxLength(127)
  @IsOptional()
  readonly firstname?: string;

  @IsString()
  @MinLength(2)
  @MaxLength(127)
  @IsOptional()
  readonly lastname?: string;

  @IsString()
  @MinLength(8)
  @MaxLength(31)
  @IsOptional()
  @IsPhoneNumber(null)
  readonly phone?: string;

  @IsString()
  @MinLength(2)
  @MaxLength(255)
  @IsOptional()
  readonly businessName?: string;

  @IsString()
  @MaxLength(511)
  @IsOptional()
  readonly description?: string;

  @IsString()
  @MaxLength(511)
  @IsOptional()
  readonly notes?: string;

  @IsOptional()
  readonly addressId?: number;
}
