"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const jwt_1 = require("@nestjs/jwt");
const passport_1 = require("@nestjs/passport");
const user_entity_1 = require("./entities/user.entity");
const video_entity_1 = require("./entities/video.entity");
const comment_entity_1 = require("./entities/comment.entity");
const like_entity_1 = require("./entities/like.entity");
const auth_service_1 = require("./services/auth.service");
const user_service_1 = require("./services/user.service");
const video_service_1 = require("./services/video.service");
const comment_service_1 = require("./services/comment.service");
const app_controller_1 = require("./app.controller");
const auth_controller_1 = require("./controllers/auth.controller");
const users_controller_1 = require("./controllers/users.controller");
const videos_controller_1 = require("./controllers/videos.controller");
const comments_controller_1 = require("./controllers/comments.controller");
const jwt_strategy_1 = require("./strategies/jwt.strategy");
const jwt_auth_guard_1 = require("./guards/jwt-auth.guard");
const optional_auth_guard_1 = require("./guards/optional-auth.guard");
const app_service_1 = require("./app.service");
const database_config_1 = require("./config/database.config");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: database_config_1.getDatabaseConfig,
                inject: [config_1.ConfigService],
            }),
            typeorm_1.TypeOrmModule.forFeature([user_entity_1.User, video_entity_1.Video, comment_entity_1.Comment, like_entity_1.Like]),
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                useFactory: async (configService) => ({
                    secret: configService.get('JWT_SECRET') || 'your-super-secret-jwt-key-for-bluesocial',
                    signOptions: {
                        expiresIn: configService.get('JWT_EXPIRES_IN') || '7d',
                    },
                }),
                inject: [config_1.ConfigService],
            }),
            passport_1.PassportModule.register({ defaultStrategy: 'jwt' }),
        ],
        controllers: [
            app_controller_1.AppController,
            auth_controller_1.AuthController,
            users_controller_1.UsersController,
            videos_controller_1.VideosController,
            comments_controller_1.CommentsController,
        ],
        providers: [
            app_service_1.AppService,
            auth_service_1.AuthService,
            user_service_1.UserService,
            video_service_1.VideoService,
            comment_service_1.CommentService,
            jwt_strategy_1.JwtStrategy,
            jwt_auth_guard_1.JwtAuthGuard,
            optional_auth_guard_1.OptionalJwtAuthGuard,
        ],
        exports: [auth_service_1.AuthService, user_service_1.UserService, video_service_1.VideoService, comment_service_1.CommentService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map