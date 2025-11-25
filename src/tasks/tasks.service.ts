import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskStatus } from '../common/enums/task-status.enum';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
  ) {}

  // Get all tasks
  findAll() {
    return this.tasksRepository.find({
      relations: ['department'],
    });
  }

  // Get task by ID
  async findOne(id: string) {
    const task = await this.tasksRepository.findOne({
      where: { id },
      relations: ['department'],
    });

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    return task;
  }

  // Create new task
  create(createTaskDto: CreateTaskDto) {
    const task = this.tasksRepository.create(createTaskDto);
    return this.tasksRepository.save(task);
  }

  // Update task
  async update(id: string, updateTaskDto: UpdateTaskDto) {
    const task = await this.findOne(id);
    Object.assign(task, updateTaskDto);
    return this.tasksRepository.save(task);
  }

  // Delete task
  async remove(id: string) {
    const task = await this.findOne(id);
    return this.tasksRepository.remove(task);
  }

  // Get tasks by department
  findByDepartment(departmentId: string) {
    return this.tasksRepository.find({
      where: { departmentId },
      relations: ['department'],
    });
  }

  // Get tasks by status
  findByStatus(status: TaskStatus) {
    return this.tasksRepository.find({
      where: { status },
      relations: ['department'],
    });
  }
}
