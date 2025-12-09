// src/departments/departments.service.ts
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Injectable,
  NotFoundException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Department } from './entities/department.entity';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';

@Injectable()
export class DepartmentsService {
  private readonly logger = new Logger(DepartmentsService.name);

  constructor(
    @InjectRepository(Department)
    private departmentsRepository: Repository<Department>,
  ) {}

  async create(createDepartmentDto: CreateDepartmentDto): Promise<Department> {
    const slug = this.generateSlug(createDepartmentDto.name);

    const exists = await this.departmentsRepository.findOne({
      where: { slug, isDeleted: false } as any,
    });
    if (exists) {
      throw new ConflictException('Department with this name already exists');
    }

    const department = this.departmentsRepository.create({
      ...createDepartmentDto,
      slug,
    });

    return this.departmentsRepository.save(department);
  }

  async findAll(): Promise<Department[]> {
    const departments = await this.departmentsRepository.find({
      where: { isDeleted: false } as any,
      relations: ['projects', 'projects.tasks'],
      order: { createdAt: 'ASC' } as any,
    });

    const validDepartments = departments.filter(
      (dept) =>
        dept.name &&
        dept.name.trim() !== '' &&
        dept.icon &&
        dept.icon.trim() !== '',
    );

    if (validDepartments.length < departments.length) {
      const invalidDepts = departments.filter(
        (d) => !validDepartments.includes(d),
      );
      this.logger.warn(
        `Found ${invalidDepts.length} invalid departments with IDs: ${invalidDepts.map((d) => (d as any).id).join(', ')}`,
      );
    }

    return validDepartments;
  }

  async findAllWithDeleted(): Promise<Department[]> {
    return await this.departmentsRepository.find({
      relations: ['projects', 'projects.tasks'],
      order: { createdAt: 'ASC' } as any,
    });
  }

  async findDeletedDepartments(): Promise<Department[]> {
    return await this.departmentsRepository.find({
      where: { isDeleted: true } as any,
      relations: ['projects', 'projects.tasks'],
      order: { createdAt: 'ASC' } as any,
    });
  }

  async findOne(id: number): Promise<Department> {
    const department = await this.departmentsRepository.findOne({
      where: { id, isDeleted: false } as any,
      relations: ['projects', 'projects.tasks'],
    });

    if (!department) {
      throw new NotFoundException(`Department with ID ${id} not found`);
    }

    return department;
  }

  async findBySlug(slug: string): Promise<Department> {
    const department = await this.departmentsRepository.findOne({
      where: { slug, isDeleted: false } as any,
      relations: ['projects', 'projects.tasks'],
    });

    if (!department) {
      throw new NotFoundException(`Department with slug ${slug} not found`);
    }

    return department;
  }

  async update(
    id: number,
    updateDepartmentDto: UpdateDepartmentDto,
  ): Promise<Department> {
    const department = await this.findOne(id);

    if (updateDepartmentDto.name) {
      const slug = this.generateSlug(updateDepartmentDto.name);
      const exists = await this.departmentsRepository.findOne({
        where: { slug, isDeleted: false } as any,
      });

      if (exists && (exists as any).id !== id) {
        throw new ConflictException('Department with this name already exists');
      }
      department.slug = slug;
    }

    Object.assign(department, updateDepartmentDto);
    return this.departmentsRepository.save(department);
  }

  async softDelete(id: number): Promise<void> {
    const department = await this.departmentsRepository.findOne({
      where: { id } as any,
    });

    if (!department) {
      throw new NotFoundException(`Department with ID ${id} not found`);
    }

    (department as any).isDeleted = true;
    await this.departmentsRepository.save(department);
    this.logger.log(`Department with ID ${id} has been soft deleted`);
  }

  async restore(id: number): Promise<void> {
    const department = await this.departmentsRepository.findOne({
      where: { id, isDeleted: true } as any,
    });

    if (!department) {
      throw new NotFoundException(
        `Department with ID ${id} not found or not deleted`,
      );
    }

    (department as any).isDeleted = false;
    await this.departmentsRepository.save(department);
    this.logger.log(`Department with ID ${id} has been restored`);
  }

  async remove(id: number): Promise<void> {
    await this.softDelete(id);
  }

  async hardDelete(id: number): Promise<void> {
    const department = await this.departmentsRepository.findOne({
      where: { id } as any,
    });

    if (!department) {
      throw new NotFoundException(`Department with ID ${id} not found`);
    }

    await this.departmentsRepository.remove(department);
    this.logger.log(`Department with ID ${id} has been permanently deleted`);
  }

  async cleanInvalidDepartments(): Promise<number> {
    const allDepts = await this.departmentsRepository.find({
      where: { isDeleted: false } as any,
    });
    const invalidDepts = allDepts.filter(
      (dept) =>
        !dept.name ||
        dept.name.trim() === '' ||
        !dept.icon ||
        dept.icon.trim() === '',
    );

    if (invalidDepts.length > 0) {
      for (const dept of invalidDepts) {
        await this.softDelete((dept as any).id);
      }
      this.logger.log(
        `Soft deleted ${invalidDepts.length} invalid departments with IDs: ${invalidDepts.map((d) => (d as any).id).join(', ')}`,
      );
    }

    return invalidDepts.length;
  }

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
  }
}
