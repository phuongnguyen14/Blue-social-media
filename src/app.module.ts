import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

// Entities
import { User } from './entities/user.entity';
import { Video } from './entities/video.entity';
import { Comment } from './entities/comment.entity';
import { Like } from './entities/like.entity';

// Services
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';
import { VideoService } from './services/video.service';
import { CommentService } from './services/comment.service';

// Controllers
import { AppController } from './app.controller';
import { AuthController } from './controllers/auth.controller';
import { UsersController } from './controllers/users.controller';
import { VideosController } from './controllers/videos.controller';
import { CommentsController } from './controllers/comments.controller';

// Guards & Strategies
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from './guards/optional-auth.guard';

// App Service
import { AppService } from './app.service';

// Database Config
import { getDatabaseConfig } from './config/database.config';

@Module({
  imports: [
    // Environment Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Database Configuration
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: getDatabaseConfig,
      inject: [ConfigService],
    }),

    // TypeORM Entities
    TypeOrmModule.forFeature([User, Video, Comment, Like]),

    // JWT Configuration
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'your-super-secret-jwt-key-for-bluesocial',
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN') || '7d',
        },
      }),
      inject: [ConfigService],
    }),

    // Passport Configuration
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [
    AppController,
    AuthController,
    UsersController,
    VideosController,
    CommentsController,
  ],
  providers: [
    AppService,
    AuthService,
    UserService,
    VideoService,
    CommentService,
    JwtStrategy,
    JwtAuthGuard,
    OptionalJwtAuthGuard,
  ],
  exports: [AuthService, UserService, VideoService, CommentService],
})
export class AppModule {}
