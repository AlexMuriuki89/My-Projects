// src/projects/entities/project.entity.ts
import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Department } from '../../departments/entities/department.entity';
import { Task } from '../../tasks/entities/task.entity';
import { BaseEntity } from '../../common/entities/base.entity';

@Entity('projects')
export class Project extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'date', nullable: true, name: 'start_date' })
  startDate: Date | null;

  @Column({ type: 'date', nullable: true, name: 'end_date' })
  endDate: Date | null;

  @Column({
    type: 'enum',
    enum: [
      'pending',
      'in-progress',
      'completed',
      'active',
      'on-hold',
      'cancelled',
    ],
    default: 'pending',
  })
  status: string;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'assigned_to' })
  assignedTo: string;

  @Column({
    type: 'enum',
    enum: ['low', 'medium', 'high'],
    default: 'medium',
  })
  priority: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  color: string;

  @Column({ name: 'department_id' })
  departmentId: number;

  @ManyToOne(() => Department, (department) => department.projects, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'department_id' })
  department: Department;

  @OneToMany(() => Task, (task) => task.project)
  tasks: Task[];
}
