import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Department } from '../../departments/entities/department.entity';
import { TaskStatus } from '../../common/enums/task-status.enum';
import { TaskCategory } from '../../common/enums/task-category.enum';
import { TaskPriority } from '../../common/enums/task-priority.enum';

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column({ type: 'enum', enum: TaskStatus })
  status: TaskStatus;

  @Column({ type: 'enum', enum: TaskCategory })
  category: TaskCategory;

  @Column({ type: 'enum', enum: TaskPriority })
  priority: TaskPriority;

  @Column({ type: 'timestamp', nullable: true })
  deadline: Date | null;

  @ManyToOne(() => Department, (department) => department.tasks, {
    onDelete: 'CASCADE',
  })
  department: Department;

  @Column()
  departmentId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
