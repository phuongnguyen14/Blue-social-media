"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_service_1 = require("../services/auth.service");
const auth_dto_1 = require("../dto/auth.dto");
const jwt_auth_guard_1 = require("../guards/jwt-auth.guard");
let AuthController = class AuthController {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    async healthCheck() {
        return await this.authService.testDatabaseConnection();
    }
    async register(registerDto) {
        return await this.authService.register(registerDto);
    }
    async login(loginDto) {
        return await this.authService.login(loginDto);
    }
    async getProfile(req) {
        const { password, ...user } = req.user;
        return { user };
    }
    async changePassword(req, changePasswordDto) {
        await this.authService.changePassword(req.user.id, changePasswordDto);
        return { message: 'Đổi mật khẩu thành công' };
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Get)('health'),
    (0, swagger_1.ApiOperation)({ summary: 'Database health check' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "healthCheck", null);
__decorate([
    (0, common_1.Post)('register'),
    (0, swagger_1.ApiOperation)({ summary: 'Đăng ký tài khoản mới' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Đăng ký thành công' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Email hoặc username đã tồn tại' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.RegisterDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('login'),
    (0, swagger_1.ApiOperation)({ summary: 'Đăng nhập' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Đăng nhập thành công' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Thông tin đăng nhập không hợp lệ' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.LoginDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Get)('profile'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Lấy thông tin profile người dùng' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lấy thông tin thành công' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Chưa đăng nhập' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Post)('change-password'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Đổi mật khẩu' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Đổi mật khẩu thành công' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Chưa đăng nhập hoặc mật khẩu hiện tại không đúng' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, auth_dto_1.ChangePasswordDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "changePassword", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)('Authentication'),
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map