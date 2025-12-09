import { IsString, IsOptional, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateDepartmentDto {
  @ApiProperty({
    description: 'Department name',
    example: 'Engineering',
    required: false,
    minLength: 2,
    maxLength: 100,
  })
  @IsString()
  @IsOptional()
  @MinLength(2)
  @MaxLength(100)
  name?: string;

  @ApiProperty({
    description: 'Department icon',
    example: '💻',
    required: false,
    maxLength: 10,
  })
  @IsString()
  @IsOptional()
  @MaxLength(10)
  icon?: string;

  @ApiProperty({
    description: 'Department description',
    example: 'Updated description',
    required: false,
    minLength: 5,
    maxLength: 500,
  })
  @IsString()
  @IsOptional()
  @MinLength(5)
  @MaxLength(500)
  description?: string;
}
