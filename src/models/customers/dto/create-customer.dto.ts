import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateCustomerDto {
  @IsNotEmpty()
  user_id: number;

  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  readonly fullname: string;

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
  readonly business_name?: string;

  @IsString()
  @IsOptional()
  readonly description?: string;

  @IsString()
  @IsOptional()
  readonly notes?: string;
}
