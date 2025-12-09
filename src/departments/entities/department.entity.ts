// src/departments/entities/department.entity.ts
import { Entity, Column, OneToMany } from 'typeorm';
import { Project } from '../../projects/entities/project.entity';
import { BaseEntity } from '../../common/entities/base.entity';

@Entity('departments')
export class Department extends BaseEntity {
  @Column({ unique: true })
  name: string;

  @Column({ length: 10 })
  icon: string;

  @Column()
  description: string;

  @Column({ unique: true })
  slug: string;

  @OneToMany(() => Project, (project) => project.department, { cascade: true })
  projects: Project[];
}
