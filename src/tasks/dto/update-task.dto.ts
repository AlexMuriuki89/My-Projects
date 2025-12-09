import { IsString, IsOptional, IsEnum, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TaskStatus } from '../../common/enums/task-status.enum';
import { TaskCategory } from '../../common/enums/task-category.enum';
import { TaskPriority } from '../../common/enums/task-priority.enum';

export class UpdateTaskDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ enum: TaskStatus, required: false })
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @ApiProperty({ enum: TaskCategory, required: false })
  @IsOptional()
  @IsEnum(TaskCategory)
  category?: TaskCategory;

  @ApiProperty({ enum: TaskPriority, required: false })
  @IsOptional()
  @IsEnum(TaskPriority)
  priority?: TaskPriority;

  @ApiProperty({ required: false })
  @IsOptional()
  deadline?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  projectId?: number;
}
