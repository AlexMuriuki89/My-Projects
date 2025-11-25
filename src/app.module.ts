import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { DepartmentsModule } from './departments/departments.module';
import { TasksModule } from './tasks/tasks.module';
import { Department } from './departments/entities/department.entity';
import { Task } from './tasks/entities/task.entity';
import { TasksnbnestController } from './g/tasksnbnest/tasksnbnest.controller';
import { DepartmentsnestController } from './g/departmentsnest/departmentsnest.controller';

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
      entities: [Department, Task],
      synchronize: true, // ⚠️ Set to false in production
      logging: true,
      logger: 'advanced-console',
    }),
    DepartmentsModule,
    TasksModule,
  ],
  controllers: [TasksnbnestController, DepartmentsnestController],
})
export class AppModule {}
