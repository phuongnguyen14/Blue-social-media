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
exports.CommentService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const comment_entity_1 = require("../entities/comment.entity");
const video_entity_1 = require("../entities/video.entity");
const like_entity_1 = require("../entities/like.entity");
let CommentService = class CommentService {
    commentRepository;
    videoRepository;
    likeRepository;
    constructor(commentRepository, videoRepository, likeRepository) {
        this.commentRepository = commentRepository;
        this.videoRepository = videoRepository;
        this.likeRepository = likeRepository;
    }
    async createComment(videoId, userId, createCommentDto) {
        const { content, parentId } = createCommentDto;
        const video = await this.videoRepository.findOne({ where: { id: videoId } });
        if (!video) {
            throw new common_1.NotFoundException('Video không tồn tại');
        }
        if (parentId) {
            const parentComment = await this.commentRepository.findOne({ where: { id: parentId, videoId } });
            if (!parentComment) {
                throw new common_1.NotFoundException('Comment cha không tồn tại');
            }
        }
        const newComment = this.commentRepository.create({
            content,
            videoId,
            userId,
            parentId,
        });
        const savedComment = await this.commentRepository.save(newComment);
        await this.videoRepository.increment({ id: videoId }, 'commentsCount', 1);
        const savedCommentWithRelations = await this.commentRepository.findOne({
            where: { id: savedComment.id },
            relations: ['user', 'replies', 'replies.user'],
        });
        if (!savedCommentWithRelations) {
            throw new common_1.NotFoundException('Comment vừa tạo không tìm thấy');
        }
        return savedCommentWithRelations;
    }
    async getComments(videoId, getCommentsDto) {
        const { page = 1, limit = 20, parentId } = getCommentsDto;
        const query = this.commentRepository
            .createQueryBuilder('comment')
            .leftJoinAndSelect('comment.user', 'user')
            .leftJoinAndSelect('comment.replies', 'replies')
            .leftJoinAndSelect('replies.user', 'repliesUser')
            .where('comment.videoId = :videoId', { videoId });
        if (parentId) {
            query.andWhere('comment.parentId = :parentId', { parentId });
        }
        else {
            query.andWhere('comment.parentId IS NULL');
        }
        query
            .orderBy('comment.createdAt', 'DESC')
            .skip((page - 1) * limit)
            .take(limit);
        const [comments, total] = await query.getManyAndCount();
        return { comments, total };
    }
    async updateComment(commentId, userId, updateCommentDto) {
        const comment = await this.commentRepository.findOne({
            where: { id: commentId },
            relations: ['user'],
        });
        if (!comment) {
            throw new common_1.NotFoundException('Comment không tồn tại');
        }
        if (comment.userId !== userId) {
            throw new common_1.ForbiddenException('Bạn không có quyền sửa comment này');
        }
        comment.content = updateCommentDto.content;
        return await this.commentRepository.save(comment);
    }
    async deleteComment(commentId, userId) {
        const comment = await this.commentRepository.findOne({
            where: { id: commentId },
        });
        if (!comment) {
            throw new common_1.NotFoundException('Comment không tồn tại');
        }
        if (comment.userId !== userId) {
            throw new common_1.ForbiddenException('Bạn không có quyền xóa comment này');
        }
        await this.commentRepository.remove(comment);
        await this.videoRepository.decrement({ id: comment.videoId }, 'commentsCount', 1);
    }
    async likeComment(commentId, userId) {
        const comment = await this.commentRepository.findOne({ where: { id: commentId } });
        if (!comment) {
            throw new common_1.NotFoundException('Comment không tồn tại');
        }
        const existingLike = await this.likeRepository.findOne({
            where: { commentId, userId, type: like_entity_1.LikeType.COMMENT },
        });
        if (existingLike) {
            await this.likeRepository.remove(existingLike);
            await this.commentRepository.decrement({ id: commentId }, 'likesCount', 1);
        }
        else {
            const like = this.likeRepository.create({
                commentId,
                userId,
                type: like_entity_1.LikeType.COMMENT,
            });
            await this.likeRepository.save(like);
            await this.commentRepository.increment({ id: commentId }, 'likesCount', 1);
        }
    }
};
exports.CommentService = CommentService;
exports.CommentService = CommentService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(comment_entity_1.Comment)),
    __param(1, (0, typeorm_1.InjectRepository)(video_entity_1.Video)),
    __param(2, (0, typeorm_1.InjectRepository)(like_entity_1.Like)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], CommentService);
//# sourceMappingURL=comment.service.js.map