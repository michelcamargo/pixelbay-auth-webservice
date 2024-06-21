import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class AvailabilityUserDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MinLength(8)
  @IsOptional()
  readonly alias?: string;

  @IsEmail()
  @IsNotEmpty()
  readonly email: string;
}
