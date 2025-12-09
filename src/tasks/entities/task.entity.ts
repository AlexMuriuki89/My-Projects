// src/tasks/entities/task.entity.ts
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Project } from '../../projects/entities/project.entity';
import { BaseEntity } from '../../common/entities/base.entity';

export enum TaskStatus {
  PENDING = 'PENDING',
  ONGOING = 'ONGOING',
  COMPLETED = 'COMPLETED',
  OVERDUE = 'OVERDUE',
}

export enum TaskCategory {
  CRITICAL = 'CRITICAL',
  OPEN_FLOAT = 'OPEN_FLOAT',
  MERCHANT_CREDIT = 'MERCHANT_CREDIT',
  PFMS = 'PFMS',
  DRIVE = 'DRIVE',
  SUMMARY = 'SUMMARY',
}

export enum TaskPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

@Entity('tasks')
export class Task extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({
    type: 'enum',
    enum: TaskStatus,
    default: TaskStatus.PENDING,
  })
  status: TaskStatus;

  @Column({
    type: 'enum',
    enum: TaskCategory,
  })
  category: TaskCategory;

  @Column({
    type: 'enum',
    enum: TaskPriority,
    default: TaskPriority.MEDIUM,
  })
  priority: TaskPriority;

  @Column({ type: 'timestamp', nullable: true })
  deadline: Date | null;

  @Column({ name: 'projectId' })
  projectId: number;

  @ManyToOne(() => Project, (project) => project.tasks, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'projectId' })
  project: Project;
}
