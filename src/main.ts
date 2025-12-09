import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useStaticAssets(join(__dirname, '..', 'public'));

  app.enableCors({
    origin: [
      'http://localhost:5173', // Vue dev server
      'http://localhost:3001',
      'http://localhost:8080',
      'http://localhost:3000',
      'http://127.0.0.1:5500',
      'http://127.0.0.1:5501',
      'http://localhost:5500',
      'null',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  });

  // Set global prefix for all API routes
  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(new AllExceptionsFilter());

  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('Task Management API')
    .setDescription('API for managing tasks, departments, and authentication')
    .setVersion('1.0')
    .addTag('auth', 'Authentication endpoints')
    .addTag('tasks', 'Task management endpoints')
    .addTag('departments', 'Department management endpoints')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth', // This name here is important for matching up with @ApiBearerAuth() in your controller!
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 Application is running on: http://localhost:${port}`);
  console.log(`📚 API Documentation: http://localhost:${port}/api/docs`);
  console.log(`📄 Swagger JSON: http://localhost:${port}/api/docs-json`);
  console.log(`🔐 Auth endpoints:`);
  console.log(`   - Register: POST http://localhost:${port}/api/auth/register`);
  console.log(`   - Login:    POST http://localhost:${port}/api/auth/login`);
  console.log(`   - Profile:  GET  http://localhost:${port}/api/auth/me`);
  console.log(
    `🔗 Departments endpoint: http://localhost:${port}/api/departments`,
  );
}

void bootstrap().catch((err) => {
  console.error('Failed to start application:', err);
  process.exit(1);
});
