import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  fullname: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  username: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  client_id: string;

  @IsNotEmpty()
  @IsString()
  oauth_id: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;
}
