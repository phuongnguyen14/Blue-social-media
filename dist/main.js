"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: true,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
    }));
    app.setGlobalPrefix('api/v1');
    const config = new swagger_1.DocumentBuilder()
        .setTitle('BlueSocialMedia API')
        .setDescription('API documentation for BlueSocialMedia - Video Social Media App')
        .setVersion('1.0')
        .addBearerAuth()
        .addTag('Authentication', 'Authentication endpoints')
        .addTag('Users', 'User management endpoints')
        .addTag('Videos', 'Video management endpoints')
        .addTag('Comments', 'Comment management endpoints')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/docs', app, document);
    const port = process.env.PORT || 3000;
    const host = process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost';
    await app.listen(port, host);
    console.log(`🚀 BlueSocialMedia API is running on: http://${host}:${port}`);
    console.log(`📚 Swagger Documentation: http://${host}:${port}/api/docs`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
    console.log(`💾 Database: ${process.env.DATABASE_URL ? 'Connected' : 'Local'}`);
}
bootstrap();
//# sourceMappingURL=main.js.map