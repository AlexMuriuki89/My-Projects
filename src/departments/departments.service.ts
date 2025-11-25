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
      where: { slug },
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
    return this.departmentsRepository.find({
      relations: ['tasks'],
      order: { createdAt: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Department> {
    const department = await this.departmentsRepository.findOne({
      where: { id },
      relations: ['tasks'],
    });

    if (!department) {
      throw new NotFoundException(`Department with ID ${id} not found`);
    }

    return department;
  }

  async findBySlug(slug: string): Promise<Department> {
    const department = await this.departmentsRepository.findOne({
      where: { slug },
      relations: ['tasks'],
    });

    if (!department) {
      throw new NotFoundException(`Department with slug ${slug} not found`);
    }

    return department;
  }

  async update(
    id: string,
    updateDepartmentDto: UpdateDepartmentDto,
  ): Promise<Department> {
    const department = await this.findOne(id);

    if (updateDepartmentDto.name) {
      const slug = this.generateSlug(updateDepartmentDto.name);
      const exists = await this.departmentsRepository.findOne({
        where: { slug },
      });

      if (exists && exists.id !== id) {
        throw new ConflictException('Department with this name already exists');
      }
      department.slug = slug;
    }

    Object.assign(department, updateDepartmentDto);
    return this.departmentsRepository.save(department);
  }

  async remove(id: string): Promise<void> {
    const department = await this.findOne(id);
    await this.departmentsRepository.remove(department);
  }

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
  }
}
