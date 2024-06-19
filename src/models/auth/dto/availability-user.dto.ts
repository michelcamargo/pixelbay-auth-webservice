import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";

export class AvailabilityUserDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly alias?: string;

  @IsEmail()
  @IsNotEmpty()
  readonly email: string;
}
