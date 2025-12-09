// src/users/dto/create-user.dto.ts
import {
  IsEmail,
  IsString,
  IsNotEmpty,
  MinLength,
  IsOptional,
  IsEnum,
  IsNumber,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsEnum(['admin', 'user'])
  @IsOptional()
  role?: string;

  @IsNumber()
  @IsOptional()
  departmentId?: number;

  @IsOptional()
  isActive?: boolean;
}
