import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { DepartmentsModule } from './departments/departments.module';
import { ProjectsModule } from './projects/projects.module';
import { TasksModule } from './tasks/tasks.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { Department } from './departments/entities/department.entity';
import { Project } from './projects/entities/project.entity';
import { Task } from './tasks/entities/task.entity';
import { User } from './users/entities/user.entity';
import { TasksnbnestController } from './g/tasksnbnest/tasksnbnest.controller';
import { DepartmentsnestController } from './g/departmentsnest/departmentsnest.controller';
import { UsersnestService } from './g/usersnest/usersnest.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      name: 'default',
      type: 'mysql',
      host: process.env.DATABASE_HOST || 'localhost',
      port: parseInt(process.env.DATABASE_PORT || '3306'),
      username: process.env.DATABASE_USER || 'root',
      password: process.env.DATABASE_PASSWORD || 'Shatob92',
      database: process.env.DATABASE_NAME || 'pm_db',
      entities: [Department, Project, Task, User], // ✅ Added User entity
      synchronize: true, // ⚠️ Set to false in production
      logging: true,
      logger: 'advanced-console',
    }),
    DepartmentsModule,
    ProjectsModule,
    TasksModule,
    AuthModule,
    UsersModule,
  ],
  controllers: [TasksnbnestController, DepartmentsnestController],
  providers: [UsersnestService],
})
export class AppModule {}
