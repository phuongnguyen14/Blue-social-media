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
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bcrypt = require("bcrypt");
const user_entity_1 = require("../entities/user.entity");
let AuthService = AuthService_1 = class AuthService {
    userRepository;
    jwtService;
    logger = new common_1.Logger(AuthService_1.name);
    constructor(userRepository, jwtService) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }
    async register(registerDto) {
        try {
            this.logger.log('🚀 Starting user registration...');
            const { email, username, password, fullName } = registerDto;
            this.logger.log(`📧 Checking existing user for email: ${email}, username: ${username}`);
            const existingUser = await this.userRepository.findOne({
                where: [{ email }, { username }],
            });
            if (existingUser) {
                this.logger.warn(`❌ User already exists: ${existingUser.email || existingUser.username}`);
                throw new common_1.ConflictException('Email hoặc username đã tồn tại');
            }
            this.logger.log('🔒 Hashing password...');
            const hashedPassword = await bcrypt.hash(password, 12);
            this.logger.log('👤 Creating user entity...');
            const user = this.userRepository.create({
                email,
                username,
                password: hashedPassword,
                fullName,
            });
            this.logger.log('💾 Saving user to database...');
            const savedUser = await this.userRepository.save(user);
            this.logger.log(`✅ User saved successfully with ID: ${savedUser.id}`);
            this.logger.log('🎫 Generating JWT token...');
            const payload = { sub: savedUser.id, email: savedUser.email, username: savedUser.username };
            const access_token = this.jwtService.sign(payload);
            const { password: _, ...userResponse } = savedUser;
            this.logger.log('🎉 Registration completed successfully!');
            return {
                user: userResponse,
                access_token,
            };
        }
        catch (error) {
            this.logger.error('💥 Registration error:', error);
            this.logger.error('Error stack:', error.stack);
            throw error;
        }
    }
    async login(loginDto) {
        const { emailOrUsername, password } = loginDto;
        const user = await this.userRepository.findOne({
            where: [
                { email: emailOrUsername },
                { username: emailOrUsername },
            ],
        });
        if (!user) {
            throw new common_1.UnauthorizedException('Thông tin đăng nhập không hợp lệ');
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Thông tin đăng nhập không hợp lệ');
        }
        if (!user.isActive) {
            throw new common_1.UnauthorizedException('Tài khoản đã bị khóa');
        }
        const payload = { sub: user.id, email: user.email, username: user.username };
        const access_token = this.jwtService.sign(payload);
        const { password: _, ...userResponse } = user;
        return {
            user: userResponse,
            access_token,
        };
    }
    async validateUser(userId) {
        const user = await this.userRepository.findOne({
            where: { id: userId, isActive: true },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('Người dùng không tồn tại');
        }
        return user;
    }
    async changePassword(userId, changePasswordDto) {
        const { currentPassword, newPassword } = changePasswordDto;
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new common_1.NotFoundException('Người dùng không tồn tại');
        }
        const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isCurrentPasswordValid) {
            throw new common_1.UnauthorizedException('Mật khẩu hiện tại không đúng');
        }
        const hashedNewPassword = await bcrypt.hash(newPassword, 12);
        await this.userRepository.update(userId, { password: hashedNewPassword });
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map