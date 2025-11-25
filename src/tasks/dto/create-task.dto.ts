import { IsString, IsOptional, IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TaskStatus } from '../../common/enums/task-status.enum';
import { TaskCategory } from '../../common/enums/task-category.enum';
import { TaskPriority } from '../../common/enums/task-priority.enum';

export class CreateTaskDto {
  @ApiProperty({
    description: 'Task title',
    example: 'Complete project documentation',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Detailed description of the task',
    example: 'Write comprehensive API documentation for all endpoints',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    enum: TaskStatus,
    description: 'Current status of the task',
    example: TaskStatus.PENDING,
  })
  @IsEnum(TaskStatus)
  @IsNotEmpty()
  status: TaskStatus;

  @ApiProperty({
    enum: TaskCategory,
    description: 'Task category',
  })
  @IsEnum(TaskCategory)
  @IsNotEmpty()
  category: TaskCategory;

  @ApiProperty({
    enum: TaskPriority,
    description: 'Task priority level',
  })
  @IsEnum(TaskPriority)
  @IsNotEmpty()
  priority: TaskPriority;

  @ApiProperty({
    description: 'Task deadline',
    example: '2025-12-31T23:59:59.000Z',
    required: false,
    type: String,
    format: 'date-time',
  })
  @IsOptional()
  deadline?: Date;

  @ApiProperty({
    description: 'UUID of the department this task belongs to',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
  })
  @IsString()
  @IsNotEmpty()
  departmentId: string;
}
