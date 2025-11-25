import { IsString, IsOptional, IsEnum } from 'class-validator';
import { TaskStatus } from '../../common/enums/task-status.enum';
import { TaskCategory } from '../../common/enums/task-category.enum';
import { TaskPriority } from '../../common/enums/task-priority.enum';

export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @IsOptional()
  @IsEnum(TaskCategory)
  category?: TaskCategory;

  @IsOptional()
  @IsEnum(TaskPriority)
  priority?: TaskPriority;

  @IsOptional()
  deadline?: Date;
}
