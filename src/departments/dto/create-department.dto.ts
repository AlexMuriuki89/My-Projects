import {
  IsString,
  IsNotEmpty,
  MaxLength,
  MinLength,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDepartmentDto {
  @ApiProperty({
    description: 'Name of the department',
    example: 'Engineering',
    minLength: 2,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @ApiProperty({
    description: 'Icon representing the department',
    example: 'EN',
    maxLength: 10,
    required: false, // Make it optional in Swagger docs
  })
  @IsString()
  @IsOptional() // Changed from @IsNotEmpty() to @IsOptional()
  @MaxLength(10)
  icon?: string; // Added ? to make it optional in TypeScript

  @ApiProperty({
    description: 'Detailed description of the department',
    example: 'Engineering Department',
    minLength: 5,
    maxLength: 500,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(500)
  description: string;
}
