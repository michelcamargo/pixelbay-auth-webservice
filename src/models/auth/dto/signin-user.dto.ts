import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class SignInUserDto {
  @IsNotEmpty()
  @MinLength(6)
  readonly username: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  readonly secret: string;
}
