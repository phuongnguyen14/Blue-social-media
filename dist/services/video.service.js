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
exports.VideoService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const video_entity_1 = require("../entities/video.entity");
const like_entity_1 = require("../entities/like.entity");
const user_entity_1 = require("../entities/user.entity");
let VideoService = class VideoService {
    videoRepository;
    likeRepository;
    userRepository;
    constructor(videoRepository, likeRepository, userRepository) {
        this.videoRepository = videoRepository;
        this.likeRepository = likeRepository;
        this.userRepository = userRepository;
    }
    async createVideo(userId, createVideoDto) {
        const video = this.videoRepository.create({
            ...createVideoDto,
            userId,
        });
        const savedVideo = await this.videoRepository.save(video);
        await this.userRepository.increment({ id: userId }, 'videosCount', 1);
        const videoWithUser = await this.videoRepository.findOne({
            where: { id: savedVideo.id },
            relations: ['user'],
        });
        if (!videoWithUser) {
            throw new common_1.NotFoundException('Video vừa tạo không tìm thấy');
        }
        return videoWithUser;
    }
    async findById(id, userId) {
        const video = await this.videoRepository.findOne({
            where: { id },
            relations: ['user', 'comments', 'comments.user'],
        });
        if (!video) {
            throw new common_1.NotFoundException('Video không tồn tại');
        }
        if (video.isPremium && userId) {
            const user = await this.userRepository.findOne({ where: { id: userId } });
            if (!user?.isPremium && video.userId !== userId) {
                throw new common_1.ForbiddenException('Cần tài khoản premium để xem video này');
            }
        }
        await this.videoRepository.increment({ id }, 'viewsCount', 1);
        return video;
    }
    async getVideos(getVideosDto, userId) {
        const { search, category, userId: authorId, page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'DESC' } = getVideosDto;
        const query = this.videoRepository
            .createQueryBuilder('video')
            .leftJoinAndSelect('video.user', 'user')
            .where('video.isPublic = :isPublic', { isPublic: true });
        if (userId) {
            const user = await this.userRepository.findOne({ where: { id: userId } });
            if (!user?.isPremium) {
                query.andWhere('(video.isPremium = :isPremium OR video.userId = :userId)', { isPremium: false, userId });
            }
        }
        else {
            query.andWhere('video.isPremium = :isPremium', { isPremium: false });
        }
        if (search) {
            query.andWhere('(video.title ILIKE :search OR video.description ILIKE :search OR :search = ANY(video.tags))', { search: `%${search}%` });
        }
        if (category) {
            query.andWhere('video.category = :category', { category });
        }
        if (authorId) {
            query.andWhere('video.userId = :authorId', { authorId });
        }
        query
            .orderBy(`video.${sortBy}`, sortOrder)
            .skip((page - 1) * limit)
            .take(limit);
        const [videos, total] = await query.getManyAndCount();
        return { videos, total };
    }
    async updateVideo(videoId, userId, updateVideoDto) {
        const video = await this.findById(videoId);
        if (video.userId !== userId) {
            throw new common_1.ForbiddenException('Bạn không có quyền sửa video này');
        }
        Object.assign(video, updateVideoDto);
        return await this.videoRepository.save(video);
    }
    async deleteVideo(videoId, userId) {
        const video = await this.findById(videoId);
        if (video.userId !== userId) {
            throw new common_1.ForbiddenException('Bạn không có quyền xóa video này');
        }
        await this.videoRepository.remove(video);
        await this.userRepository.decrement({ id: userId }, 'videosCount', 1);
    }
    async likeVideo(videoId, userId) {
        const video = await this.findById(videoId);
        const existingLike = await this.likeRepository.findOne({
            where: { videoId, userId, type: like_entity_1.LikeType.VIDEO },
        });
        if (existingLike) {
            await this.likeRepository.remove(existingLike);
            await this.videoRepository.decrement({ id: videoId }, 'likesCount', 1);
        }
        else {
            const like = this.likeRepository.create({
                videoId,
                userId,
                type: like_entity_1.LikeType.VIDEO,
            });
            await this.likeRepository.save(like);
            await this.videoRepository.increment({ id: videoId }, 'likesCount', 1);
        }
    }
    async getTrendingVideos(limit = 20) {
        return await this.videoRepository
            .createQueryBuilder('video')
            .leftJoinAndSelect('video.user', 'user')
            .where('video.isPublic = :isPublic', { isPublic: true })
            .andWhere('video.isPremium = :isPremium', { isPremium: false })
            .andWhere('video.createdAt >= :date', { date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) })
            .orderBy('video.viewsCount + video.likesCount * 2', 'DESC')
            .limit(limit)
            .getMany();
    }
    async getRecommendedVideos(userId, limit = 20) {
        const query = this.videoRepository
            .createQueryBuilder('video')
            .leftJoinAndSelect('video.user', 'user')
            .leftJoin('user_follows', 'follows', 'follows.followingId = video.userId')
            .where('video.isPublic = :isPublic', { isPublic: true })
            .andWhere('(follows.followerId = :userId OR video.viewsCount > 100)', { userId })
            .orderBy('CASE WHEN follows.followerId = :userId THEN 1 ELSE 2 END, video.createdAt', 'DESC')
            .limit(limit);
        return await query.getMany();
    }
};
exports.VideoService = VideoService;
exports.VideoService = VideoService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(video_entity_1.Video)),
    __param(1, (0, typeorm_1.InjectRepository)(like_entity_1.Like)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], VideoService);
//# sourceMappingURL=video.service.js.map