import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class SignUpUserDto {
  @IsString()
  @IsNotEmpty()
  readonly username: string;

  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @IsString()
  @MinLength(6)
  readonly password: string;
}
