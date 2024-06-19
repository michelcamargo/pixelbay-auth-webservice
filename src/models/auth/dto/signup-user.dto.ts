import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class SignUpUserDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly alias?: string;

  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @IsString()
  @MinLength(6)
  readonly password: string;

  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  readonly client_id?: number;
}
