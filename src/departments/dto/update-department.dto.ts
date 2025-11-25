import { IsString, IsOptional, MaxLength, MinLength } from 'class-validator';

export class UpdateDepartmentDto {
  @IsString()
  @IsOptional()
  @MinLength(2)
  @MaxLength(100)
  name?: string;

  @IsString()
  @IsOptional()
  @MaxLength(10)
  icon?: string;

  @IsString()
  @IsOptional()
  @MinLength(5)
  @MaxLength(500)
  description?: string;
}
