import {
  IsString,
  IsEnum,
  IsOptional,
  IsDateString,
  IsNumber,
  MinLength,
  MaxLength,
  Matches,
  IsPositive,
  ValidateIf,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProjectDto {
  @ApiProperty({
    description: 'Project name',
    example: 'Mobile App Development',
    required: false,
    minLength: 3,
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @MinLength(3, { message: 'Project name must be at least 3 characters long' })
  @MaxLength(255, { message: 'Project name cannot exceed 255 characters' })
  name?: string;

  @ApiProperty({
    description: 'Project description',
    example: 'Build a new mobile application for iOS and Android',
    required: false,
    minLength: 10,
    maxLength: 2000,
  })
  @IsOptional()
  @IsString()
  @MinLength(10, { message: 'Description must be at least 10 characters long' })
  @MaxLength(2000, { message: 'Description cannot exceed 2000 characters' })
  description?: string;

  @ApiProperty({
    enum: [
      'pending',
      'in-progress',
      'completed',
      'active',
      'on-hold',
      'cancelled',
    ],
    description: 'Project status',
    example: 'in-progress',
    required: false,
  })
  @IsOptional()
  @IsEnum(
    ['pending', 'in-progress', 'completed', 'active', 'on-hold', 'cancelled'],
    {
      message:
        'Status must be one of: pending, in-progress, completed, active, on-hold, cancelled',
    },
  )
  status?:
    | 'pending'
    | 'in-progress'
    | 'completed'
    | 'active'
    | 'on-hold'
    | 'cancelled';

  @ApiProperty({
    description: 'Project start date (ISO 8601 format)',
    example: '2025-12-01',
    format: 'date',
    required: false,
  })
  @IsOptional()
  @IsDateString(
    {},
    { message: 'Start date must be a valid ISO 8601 date string' },
  )
  startDate?: string;

  @ApiProperty({
    description: 'Project end date (ISO 8601 format, must be after start date)',
    example: '2026-06-30',
    format: 'date',
    required: false,
  })
  @IsOptional()
  @IsDateString(
    {},
    { message: 'End date must be a valid ISO 8601 date string' },
  )
  @ValidateIf(
    (o: UpdateProjectDto) =>
      o.endDate !== undefined && o.startDate !== undefined,
  )
  endDate?: string;

  @ApiProperty({
    description: 'Person or team assigned to the project',
    example: 'John Doe',
    required: false,
    minLength: 2,
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @MinLength(2, { message: 'Assigned name must be at least 2 characters long' })
  @MaxLength(255, { message: 'Assigned name cannot exceed 255 characters' })
  assignedTo?: string;

  @ApiProperty({
    enum: ['low', 'medium', 'high'],
    description: 'Project priority',
    example: 'high',
    required: false,
  })
  @IsOptional()
  @IsEnum(['low', 'medium', 'high'], {
    message: 'Priority must be one of: low, medium, high',
  })
  priority?: 'low' | 'medium' | 'high';

  @ApiProperty({
    description: 'Project color (hex code format: #RRGGBB)',
    example: '#4CAF50',
    required: false,
    pattern: '^#[0-9A-Fa-f]{6}$',
  })
  @IsOptional()
  @IsString()
  @Matches(/^#[0-9A-Fa-f]{6}$/, {
    message: 'Color must be a valid hex code (e.g., #4CAF50)',
  })
  color?: string;

  @ApiProperty({
    description: 'Department ID this project belongs to',
    example: 1,
    minimum: 1,
    required: false,
  })
  @IsOptional()
  @IsNumber({}, { message: 'Department ID must be a number' })
  @IsPositive({ message: 'Department ID must be a positive number' })
  departmentId?: number;
}
