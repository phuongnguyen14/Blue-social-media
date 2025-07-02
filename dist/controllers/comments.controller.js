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
exports.CommentsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const comment_service_1 = require("../services/comment.service");
const comment_dto_1 = require("../dto/comment.dto");
const jwt_auth_guard_1 = require("../guards/jwt-auth.guard");
let CommentsController = class CommentsController {
    commentService;
    constructor(commentService) {
        this.commentService = commentService;
    }
    async getComments(videoId, getCommentsDto) {
        return await this.commentService.getComments(videoId, getCommentsDto);
    }
    async createComment(videoId, req, createCommentDto) {
        const comment = await this.commentService.createComment(videoId, req.user.id, createCommentDto);
        return { comment };
    }
    async updateComment(commentId, req, updateCommentDto) {
        const comment = await this.commentService.updateComment(commentId, req.user.id, updateCommentDto);
        return { comment };
    }
    async deleteComment(commentId, req) {
        await this.commentService.deleteComment(commentId, req.user.id);
        return { message: 'Xóa comment thành công' };
    }
    async likeComment(commentId, req) {
        await this.commentService.likeComment(commentId, req.user.id);
        return { message: 'Like/Unlike thành công' };
    }
};
exports.CommentsController = CommentsController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Lấy danh sách comments của video' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, description: 'Số trang' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, description: 'Số lượng mỗi trang' }),
    (0, swagger_1.ApiQuery)({ name: 'parentId', required: false, description: 'ID comment cha (để lấy replies)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lấy danh sách thành công' }),
    __param(0, (0, common_1.Param)('videoId')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, comment_dto_1.GetCommentsDto]),
    __metadata("design:returntype", Promise)
], CommentsController.prototype, "getComments", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Tạo comment mới' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Tạo comment thành công' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Chưa đăng nhập' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Video không tồn tại' }),
    __param(0, (0, common_1.Param)('videoId')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, comment_dto_1.CreateCommentDto]),
    __metadata("design:returntype", Promise)
], CommentsController.prototype, "createComment", null);
__decorate([
    (0, common_1.Put)(':commentId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Cập nhật comment' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Cập nhật thành công' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Chưa đăng nhập' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Không có quyền sửa comment này' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Comment không tồn tại' }),
    __param(0, (0, common_1.Param)('commentId')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, comment_dto_1.UpdateCommentDto]),
    __metadata("design:returntype", Promise)
], CommentsController.prototype, "updateComment", null);
__decorate([
    (0, common_1.Delete)(':commentId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Xóa comment' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Xóa thành công' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Chưa đăng nhập' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Không có quyền xóa comment này' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Comment không tồn tại' }),
    __param(0, (0, common_1.Param)('commentId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CommentsController.prototype, "deleteComment", null);
__decorate([
    (0, common_1.Post)(':commentId/like'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Like/Unlike comment' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Like/Unlike thành công' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Chưa đăng nhập' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Comment không tồn tại' }),
    __param(0, (0, common_1.Param)('commentId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CommentsController.prototype, "likeComment", null);
exports.CommentsController = CommentsController = __decorate([
    (0, swagger_1.ApiTags)('Comments'),
    (0, common_1.Controller)('videos/:videoId/comments'),
    __metadata("design:paramtypes", [comment_service_1.CommentService])
], CommentsController);
//# sourceMappingURL=comments.controller.js.map