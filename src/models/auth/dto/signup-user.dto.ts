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
  readonly secret: string;

  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  readonly client_id?: number;
}
