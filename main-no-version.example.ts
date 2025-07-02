// 📝 Example: Remove API versioning
// File: src/main.ts

import { NestFactory } from '@nestjs/core';
// ... other imports

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // ... CORS, validation setup ...
  
  // Option 1: No versioning - chỉ /api
  app.setGlobalPrefix('api');
  
  // Option 2: No prefix at all
  // (comment out setGlobalPrefix line)
  
  // ... rest of setup ...
}

// Results:
// /api/auth/login        (Option 1)
// /auth/login            (Option 2)
// instead of /api/v1/auth/login 