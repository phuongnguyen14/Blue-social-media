import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for frontend connection
  app.enableCors({
    origin: true, // Allow all origins during development
    // Production CORS config:
    // origin: [
    //   'https://your-frontend-domain.com',
    //   'https://your-expo-app.com',
    //   /^https:\/\/.*\.railway\.app$/,
    //   /^https:\/\/.*\.vercel\.app$/,
    // ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  });

  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }));

  // API prefix
  app.setGlobalPrefix('api/v1');

  // Swagger Documentation
  const config = new DocumentBuilder()
    .setTitle('BlueSocialMedia API')
    .setDescription('API documentation for BlueSocialMedia - Video Social Media App')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('Authentication', 'Authentication endpoints')
    .addTag('Users', 'User management endpoints')
    .addTag('Videos', 'Video management endpoints')
    .addTag('Comments', 'Comment management endpoints')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // Railway requires binding to 0.0.0.0
  const port = process.env.PORT || 3000;
  const host = process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost';
  
  await app.listen(port, host);
  
  console.log(`🚀 BlueSocialMedia API is running on: http://${host}:${port}`);
  console.log(`📚 Swagger Documentation: http://${host}:${port}/api/docs`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
  console.log(`💾 Database: ${process.env.DATABASE_URL ? 'Connected' : 'Local'}`);
}

bootstrap();
