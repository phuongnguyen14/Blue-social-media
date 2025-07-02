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
exports.VideosController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const video_service_1 = require("../services/video.service");
const video_dto_1 = require("../dto/video.dto");
const jwt_auth_guard_1 = require("../guards/jwt-auth.guard");
const optional_auth_guard_1 = require("../guards/optional-auth.guard");
let VideosController = class VideosController {
    videoService;
    constructor(videoService) {
        this.videoService = videoService;
    }
    async getVideos(getVideosDto, req) {
        const userId = req.user?.id;
        return await this.videoService.getVideos(getVideosDto, userId);
    }
    async getTrendingVideos(limit = 20) {
        const videos = await this.videoService.getTrendingVideos(limit);
        return { videos };
    }
    async getRecommendedVideos(req, limit = 20) {
        const videos = await this.videoService.getRecommendedVideos(req.user.id, limit);
        return { videos };
    }
    async getVideoById(id, req) {
        const userId = req.user?.id;
        const video = await this.videoService.findById(id, userId);
        return { video };
    }
    async createVideo(req, createVideoDto) {
        const video = await this.videoService.createVideo(req.user.id, createVideoDto);
        return { video };
    }
    async updateVideo(videoId, req, updateVideoDto) {
        const video = await this.videoService.updateVideo(videoId, req.user.id, updateVideoDto);
        return { video };
    }
    async deleteVideo(videoId, req) {
        await this.videoService.deleteVideo(videoId, req.user.id);
        return { message: 'Xóa video thành công' };
    }
    async likeVideo(videoId, req) {
        await this.videoService.likeVideo(videoId, req.user.id);
        return { message: 'Like/Unlike thành công' };
    }
};
exports.VideosController = VideosController;
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(optional_auth_guard_1.OptionalJwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Lấy danh sách videos' }),
    (0, swagger_1.ApiQuery)({ name: 'search', required: false, description: 'Từ khóa tìm kiếm' }),
    (0, swagger_1.ApiQuery)({ name: 'category', required: false, description: 'Danh mục' }),
    (0, swagger_1.ApiQuery)({ name: 'userId', required: false, description: 'ID người dùng' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, description: 'Số trang' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, description: 'Số lượng mỗi trang' }),
    (0, swagger_1.ApiQuery)({ name: 'sortBy', required: false, description: 'Sắp xếp theo', enum: ['createdAt', 'viewsCount', 'likesCount'] }),
    (0, swagger_1.ApiQuery)({ name: 'sortOrder', required: false, description: 'Thứ tự sắp xếp', enum: ['ASC', 'DESC'] }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lấy danh sách thành công' }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [video_dto_1.GetVideosDto, Object]),
    __metadata("design:returntype", Promise)
], VideosController.prototype, "getVideos", null);
__decorate([
    (0, common_1.Get)('trending'),
    (0, swagger_1.ApiOperation)({ summary: 'Lấy videos trending' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, description: 'Số lượng videos' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lấy danh sách thành công' }),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], VideosController.prototype, "getTrendingVideos", null);
__decorate([
    (0, common_1.Get)('recommended'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Lấy videos đề xuất cho người dùng' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, description: 'Số lượng videos' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lấy danh sách thành công' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Chưa đăng nhập' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], VideosController.prototype, "getRecommendedVideos", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(optional_auth_guard_1.OptionalJwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Lấy thông tin video theo ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lấy thông tin thành công' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Video không tồn tại' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Cần tài khoản premium để xem video này' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], VideosController.prototype, "getVideoById", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Tạo video mới' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Tạo video thành công' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Chưa đăng nhập' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, video_dto_1.CreateVideoDto]),
    __metadata("design:returntype", Promise)
], VideosController.prototype, "createVideo", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Cập nhật video' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Cập nhật thành công' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Chưa đăng nhập' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Không có quyền sửa video này' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Video không tồn tại' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, video_dto_1.UpdateVideoDto]),
    __metadata("design:returntype", Promise)
], VideosController.prototype, "updateVideo", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Xóa video' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Xóa thành công' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Chưa đăng nhập' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Không có quyền xóa video này' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Video không tồn tại' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], VideosController.prototype, "deleteVideo", null);
__decorate([
    (0, common_1.Post)(':id/like'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Like/Unlike video' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Like/Unlike thành công' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Chưa đăng nhập' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Video không tồn tại' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], VideosController.prototype, "likeVideo", null);
exports.VideosController = VideosController = __decorate([
    (0, swagger_1.ApiTags)('Videos'),
    (0, common_1.Controller)('videos'),
    __metadata("design:paramtypes", [video_service_1.VideoService])
], VideosController);
//# sourceMappingURL=videos.controller.js.map