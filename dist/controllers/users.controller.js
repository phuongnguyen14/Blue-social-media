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
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const user_service_1 = require("../services/user.service");
const user_dto_1 = require("../dto/user.dto");
const jwt_auth_guard_1 = require("../guards/jwt-auth.guard");
let UsersController = class UsersController {
    userService;
    constructor(userService) {
        this.userService = userService;
    }
    async searchUsers(getUsersDto) {
        return await this.userService.searchUsers(getUsersDto);
    }
    async getUserById(id) {
        const user = await this.userService.findById(id);
        const { password, ...userResponse } = user;
        return { user: userResponse };
    }
    async getUserByUsername(username) {
        const user = await this.userService.findByUsername(username);
        const { password, ...userResponse } = user;
        return { user: userResponse };
    }
    async updateProfile(req, updateProfileDto) {
        const user = await this.userService.updateProfile(req.user.id, updateProfileDto);
        const { password, ...userResponse } = user;
        return { user: userResponse };
    }
    async followUser(req, followingId) {
        await this.userService.followUser(req.user.id, followingId);
        return { message: 'Follow thành công' };
    }
    async unfollowUser(req, followingId) {
        await this.userService.unfollowUser(req.user.id, followingId);
        return { message: 'Unfollow thành công' };
    }
    async getFollowers(userId, page = 1, limit = 20) {
        return await this.userService.getFollowers(userId, page, limit);
    }
    async getFollowing(userId, page = 1, limit = 20) {
        return await this.userService.getFollowing(userId, page, limit);
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.Get)('search'),
    (0, swagger_1.ApiOperation)({ summary: 'Tìm kiếm người dùng' }),
    (0, swagger_1.ApiQuery)({ name: 'search', required: false, description: 'Từ khóa tìm kiếm' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, description: 'Số trang' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, description: 'Số lượng mỗi trang' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Tìm kiếm thành công' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_dto_1.GetUsersDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "searchUsers", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Lấy thông tin người dùng theo ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lấy thông tin thành công' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Người dùng không tồn tại' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getUserById", null);
__decorate([
    (0, common_1.Get)('username/:username'),
    (0, swagger_1.ApiOperation)({ summary: 'Lấy thông tin người dùng theo username' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lấy thông tin thành công' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Người dùng không tồn tại' }),
    __param(0, (0, common_1.Param)('username')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getUserByUsername", null);
__decorate([
    (0, common_1.Put)('profile'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Cập nhật thông tin profile' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Cập nhật thành công' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Chưa đăng nhập' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, user_dto_1.UpdateProfileDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateProfile", null);
__decorate([
    (0, common_1.Post)(':id/follow'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Follow người dùng' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Follow thành công' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Chưa đăng nhập' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Người dùng không tồn tại' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Đã follow người dùng này' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "followUser", null);
__decorate([
    (0, common_1.Delete)(':id/follow'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Unfollow người dùng' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Unfollow thành công' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Chưa đăng nhập' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Người dùng không tồn tại' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "unfollowUser", null);
__decorate([
    (0, common_1.Get)(':id/followers'),
    (0, swagger_1.ApiOperation)({ summary: 'Lấy danh sách followers' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, description: 'Số trang' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, description: 'Số lượng mỗi trang' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lấy danh sách thành công' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getFollowers", null);
__decorate([
    (0, common_1.Get)(':id/following'),
    (0, swagger_1.ApiOperation)({ summary: 'Lấy danh sách following' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, description: 'Số trang' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, description: 'Số lượng mỗi trang' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lấy danh sách thành công' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getFollowing", null);
exports.UsersController = UsersController = __decorate([
    (0, swagger_1.ApiTags)('Users'),
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UsersController);
//# sourceMappingURL=users.controller.js.map