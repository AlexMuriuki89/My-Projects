// src/departments/departments.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { DepartmentsService } from './departments.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';

@ApiTags('departments')
@Controller('departments')
export class DepartmentsController {
  constructor(private readonly departmentsService: DepartmentsService) {}

  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new department' })
  @ApiResponse({ status: 201, description: 'Department created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid input' })
  @ApiResponse({ status: 409, description: 'Department already exists' })
  create(@Body() createDepartmentDto: CreateDepartmentDto) {
    return this.departmentsService.create(createDepartmentDto);
  }

  @Get('/')
  @ApiOperation({ summary: 'Get all departments' })
  @ApiResponse({ status: 200, description: 'Return all departments' })
  findAll() {
    return this.departmentsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get department by ID' })
  @ApiParam({ name: 'id', description: 'Department ID' })
  @ApiResponse({ status: 200, description: 'Return department details' })
  @ApiResponse({ status: 404, description: 'Department not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.departmentsService.findOne(id);
  }

  @Get(':id/projects')
  @ApiOperation({ summary: 'Get all projects in a department' })
  @ApiParam({ name: 'id', description: 'Department ID' })
  @ApiResponse({ status: 200, description: 'Return department projects' })
  @ApiResponse({ status: 404, description: 'Department not found' })
  async findDepartmentProjects(@Param('id', ParseIntPipe) id: number) {
    const department = await this.departmentsService.findOne(id);
    return department && 'projects' in department ? department.projects : [];
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Get department by slug' })
  @ApiParam({ name: 'slug', description: 'Department slug' })
  @ApiResponse({ status: 200, description: 'Return department details' })
  @ApiResponse({ status: 404, description: 'Department not found' })
  findBySlug(@Param('slug') slug: string) {
    return this.departmentsService.findBySlug(slug);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a department' })
  @ApiParam({ name: 'id', description: 'Department ID' })
  @ApiResponse({ status: 200, description: 'Department updated successfully' })
  @ApiResponse({ status: 404, description: 'Department not found' })
  @ApiResponse({ status: 409, description: 'Department name already exists' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDepartmentDto: UpdateDepartmentDto,
  ) {
    return this.departmentsService.update(id, updateDepartmentDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a department' })
  @ApiParam({ name: 'id', description: 'Department ID' })
  @ApiResponse({ status: 204, description: 'Department deleted successfully' })
  @ApiResponse({ status: 404, description: 'Department not found' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.departmentsService.remove(id);
  }

  @Delete('cleanup/invalid')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Clean up invalid departments' })
  @ApiResponse({ status: 200, description: 'Invalid departments cleaned up' })
  async cleanupInvalid() {
    const count = await this.departmentsService.cleanInvalidDepartments();
    return { message: `Cleaned up ${count} invalid departments`, count };
  }
}
