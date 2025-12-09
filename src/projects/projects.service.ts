// src/projects/projects.service.ts
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  private readonly logger = new Logger(ProjectsService.name);

  constructor(
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
  ) {}

  async create(createProjectDto: CreateProjectDto): Promise<Project> {
    const project = this.projectsRepository.create(createProjectDto);
    return await this.projectsRepository.save(project);
  }

  async findAll(): Promise<Project[]> {
    return await this.projectsRepository.find({
      where: { isDeleted: false } as any,
      relations: ['department', 'tasks'],
      order: { createdAt: 'DESC' } as any,
    });
  }

  async findAllWithDeleted(): Promise<Project[]> {
    return await this.projectsRepository.find({
      relations: ['department', 'tasks'],
      order: { createdAt: 'DESC' } as any,
    });
  }

  async findDeletedProjects(): Promise<Project[]> {
    return await this.projectsRepository.find({
      where: { isDeleted: true } as any,
      relations: ['department', 'tasks'],
      order: { createdAt: 'DESC' } as any,
    });
  }

  async findOne(id: number): Promise<Project> {
    const project = await this.projectsRepository.findOne({
      where: { id, isDeleted: false } as any,
      relations: ['department', 'tasks'],
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    return project;
  }

  async findByDepartment(departmentId: number): Promise<Project[]> {
    return await this.projectsRepository.find({
      where: { departmentId, isDeleted: false } as any,
      relations: ['tasks'],
      order: { createdAt: 'DESC' } as any,
    });
  }

  async update(
    id: number,
    updateProjectDto: UpdateProjectDto,
  ): Promise<Project> {
    const project = await this.findOne(id);
    Object.assign(project, updateProjectDto);
    return await this.projectsRepository.save(project);
  }

  async softDelete(id: number): Promise<void> {
    const project = await this.projectsRepository.findOne({
      where: { id } as any,
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    (project as any).isDeleted = true;
    await this.projectsRepository.save(project);
    this.logger.log(`Project with ID ${id} has been soft deleted`);
  }

  async restore(id: number): Promise<void> {
    const project = await this.projectsRepository.findOne({
      where: { id, isDeleted: true } as any,
    });

    if (!project) {
      throw new NotFoundException(
        `Project with ID ${id} not found or not deleted`,
      );
    }

    (project as any).isDeleted = false;
    await this.projectsRepository.save(project);
    this.logger.log(`Project with ID ${id} has been restored`);
  }

  async remove(id: number): Promise<void> {
    await this.softDelete(id);
  }

  async hardDelete(id: number): Promise<void> {
    const project = await this.projectsRepository.findOne({
      where: { id } as any,
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    await this.projectsRepository.remove(project);
    this.logger.log(`Project with ID ${id} has been permanently deleted`);
  }
}
