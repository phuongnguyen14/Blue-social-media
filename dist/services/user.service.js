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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../entities/user.entity");
let UserService = class UserService {
    userRepository;
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async findById(id) {
        const user = await this.userRepository.findOne({
            where: { id },
            relations: ['videos'],
        });
        if (!user) {
            throw new common_1.NotFoundException('Người dùng không tồn tại');
        }
        return user;
    }
    async findByUsername(username) {
        const user = await this.userRepository.findOne({
            where: { username },
            relations: ['videos'],
        });
        if (!user) {
            throw new common_1.NotFoundException('Người dùng không tồn tại');
        }
        return user;
    }
    async updateProfile(userId, updateProfileDto) {
        const user = await this.findById(userId);
        Object.assign(user, updateProfileDto);
        return await this.userRepository.save(user);
    }
    async followUser(followerId, followingId) {
        if (followerId === followingId) {
            throw new common_1.ConflictException('Không thể follow chính mình');
        }
        const follower = await this.findById(followerId);
        const following = await this.findById(followingId);
        const existingFollow = await this.userRepository
            .createQueryBuilder('user')
            .innerJoin('user.following', 'following', 'following.id = :followingId', { followingId })
            .where('user.id = :followerId', { followerId })
            .getOne();
        if (existingFollow) {
            throw new common_1.ConflictException('Đã follow người dùng này');
        }
        follower.following = follower.following || [];
        follower.following.push(following);
        follower.followingCount += 1;
        following.followersCount += 1;
        await this.userRepository.save([follower, following]);
    }
    async unfollowUser(followerId, followingId) {
        const follower = await this.userRepository.findOne({
            where: { id: followerId },
            relations: ['following'],
        });
        const following = await this.findById(followingId);
        if (!follower) {
            throw new common_1.NotFoundException('Người dùng không tồn tại');
        }
        follower.following = follower.following.filter(user => user.id !== followingId);
        follower.followingCount = Math.max(0, follower.followingCount - 1);
        following.followersCount = Math.max(0, following.followersCount - 1);
        await this.userRepository.save([follower, following]);
    }
    async getFollowers(userId, page = 1, limit = 20) {
        await this.findById(userId);
        const [users, total] = await this.userRepository
            .createQueryBuilder('user')
            .innerJoin('user.following', 'following', 'following.id = :userId', { userId })
            .select(['user.id', 'user.username', 'user.fullName', 'user.avatar', 'user.isVerified'])
            .skip((page - 1) * limit)
            .take(limit)
            .getManyAndCount();
        return { users, total };
    }
    async getFollowing(userId, page = 1, limit = 20) {
        await this.findById(userId);
        const [users, total] = await this.userRepository
            .createQueryBuilder('user')
            .innerJoin('user.followers', 'followers', 'followers.id = :userId', { userId })
            .select(['user.id', 'user.username', 'user.fullName', 'user.avatar', 'user.isVerified'])
            .skip((page - 1) * limit)
            .take(limit)
            .getManyAndCount();
        return { users, total };
    }
    async searchUsers(getUsersDto) {
        const { search, page = 1, limit = 10 } = getUsersDto;
        const query = this.userRepository
            .createQueryBuilder('user')
            .select(['user.id', 'user.username', 'user.fullName', 'user.avatar', 'user.isVerified', 'user.followersCount'])
            .where('user.isActive = :isActive', { isActive: true });
        if (search) {
            query.andWhere('(user.username ILIKE :search OR user.fullName ILIKE :search)', { search: `%${search}%` });
        }
        query
            .orderBy('user.followersCount', 'DESC')
            .skip((page - 1) * limit)
            .take(limit);
        const [users, total] = await query.getManyAndCount();
        return { users, total };
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UserService);
//# sourceMappingURL=user.service.js.map