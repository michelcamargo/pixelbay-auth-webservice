import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class SignInUserDto {
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  readonly password: string;
}
