// src/tasks/tasks.service.ts
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskStatus } from './entities/task.entity';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
  ) {}

  async findAll(): Promise<Task[]> {
    return await this.tasksRepository.find({
      where: { isDeleted: false } as any,
      relations: ['project', 'project.department'],
      order: { createdAt: 'DESC' } as any,
    });
  }

  async findAllWithDeleted(): Promise<Task[]> {
    return await this.tasksRepository.find({
      relations: ['project', 'project.department'],
      order: { createdAt: 'DESC' } as any,
    });
  }

  async findDeletedTasks(): Promise<Task[]> {
    return await this.tasksRepository.find({
      where: { isDeleted: true } as any,
      relations: ['project', 'project.department'],
      order: { createdAt: 'DESC' } as any,
    });
  }

  async findOne(id: number): Promise<Task> {
    const task = await this.tasksRepository.findOne({
      where: { id, isDeleted: false } as any,
      relations: ['project', 'project.department'],
    });

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    return task;
  }

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    const task = this.tasksRepository.create(createTaskDto);
    return await this.tasksRepository.save(task);
  }

  async update(id: number, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const task = await this.findOne(id);
    Object.assign(task, updateTaskDto);
    return await this.tasksRepository.save(task);
  }

  async softDelete(id: number): Promise<void> {
    const task = await this.tasksRepository.findOne({
      where: { id } as any,
    });

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    (task as any).isDeleted = true;
    await this.tasksRepository.save(task);
    this.logger.log(`Task with ID ${id} has been soft deleted`);
  }

  async restore(id: number): Promise<void> {
    const task = await this.tasksRepository.findOne({
      where: { id, isDeleted: true } as any,
    });

    if (!task) {
      throw new NotFoundException(
        `Task with ID ${id} not found or not deleted`,
      );
    }

    (task as any).isDeleted = false;
    await this.tasksRepository.save(task);
    this.logger.log(`Task with ID ${id} has been restored`);
  }

  async remove(id: number): Promise<void> {
    await this.softDelete(id);
  }

  async hardDelete(id: number): Promise<void> {
    const task = await this.tasksRepository.findOne({
      where: { id } as any,
    });

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    await this.tasksRepository.remove(task);
    this.logger.log(`Task with ID ${id} has been permanently deleted`);
  }

  async findByProject(projectId: number): Promise<Task[]> {
    return await this.tasksRepository.find({
      where: { projectId, isDeleted: false } as any,
      relations: ['project'],
      order: { createdAt: 'DESC' } as any,
    });
  }

  async findByDepartment(departmentId: number): Promise<Task[]> {
    return await this.tasksRepository
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.project', 'project')
      .leftJoinAndSelect('project.department', 'department')
      .where('project.departmentId = :departmentId', { departmentId })
      .andWhere('task.isDeleted = :isDeleted', { isDeleted: false })
      .orderBy('task.createdAt', 'DESC')
      .getMany();
  }

  async findByStatus(status: TaskStatus): Promise<Task[]> {
    return await this.tasksRepository.find({
      where: { status, isDeleted: false } as any,
      relations: ['project', 'project.department'],
      order: { createdAt: 'DESC' } as any,
    });
  }
}
