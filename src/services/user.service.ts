import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { User } from '../entities/user.entity';
import { UpdateProfileDto, GetUsersDto } from '../dto/user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['videos'],
    });

    if (!user) {
      throw new NotFoundException('Người dùng không tồn tại');
    }

    return user;
  }

  async findByUsername(username: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { username },
      relations: ['videos'],
    });

    if (!user) {
      throw new NotFoundException('Người dùng không tồn tại');
    }

    return user;
  }

  async updateProfile(userId: string, updateProfileDto: UpdateProfileDto): Promise<User> {
    const user = await this.findById(userId);
    
    Object.assign(user, updateProfileDto);
    
    return await this.userRepository.save(user);
  }

  async followUser(followerId: string, followingId: string): Promise<void> {
    if (followerId === followingId) {
      throw new ConflictException('Không thể follow chính mình');
    }

    const follower = await this.findById(followerId);
    const following = await this.findById(followingId);

    // Check if already following
    const existingFollow = await this.userRepository
      .createQueryBuilder('user')
      .innerJoin('user.following', 'following', 'following.id = :followingId', { followingId })
      .where('user.id = :followerId', { followerId })
      .getOne();

    if (existingFollow) {
      throw new ConflictException('Đã follow người dùng này');
    }

    // Add following relationship
    follower.following = follower.following || [];
    follower.following.push(following);
    
    // Update counters
    follower.followingCount += 1;
    following.followersCount += 1;

    await this.userRepository.save([follower, following]);
  }

  async unfollowUser(followerId: string, followingId: string): Promise<void> {
    const follower = await this.userRepository.findOne({
      where: { id: followerId },
      relations: ['following'],
    });
    
    const following = await this.findById(followingId);

    if (!follower) {
      throw new NotFoundException('Người dùng không tồn tại');
    }

    // Remove following relationship
    follower.following = follower.following.filter(user => user.id !== followingId);
    
    // Update counters
    follower.followingCount = Math.max(0, follower.followingCount - 1);
    following.followersCount = Math.max(0, following.followersCount - 1);

    await this.userRepository.save([follower, following]);
  }

  async getFollowers(userId: string, page: number = 1, limit: number = 20): Promise<{ users: User[]; total: number }> {
    await this.findById(userId); // Check if user exists

    const [users, total] = await this.userRepository
      .createQueryBuilder('user')
      .innerJoin('user.following', 'following', 'following.id = :userId', { userId })
      .select(['user.id', 'user.username', 'user.fullName', 'user.avatar', 'user.isVerified'])
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return { users, total };
  }

  async getFollowing(userId: string, page: number = 1, limit: number = 20): Promise<{ users: User[]; total: number }> {
    await this.findById(userId); // Check if user exists

    const [users, total] = await this.userRepository
      .createQueryBuilder('user')
      .innerJoin('user.followers', 'followers', 'followers.id = :userId', { userId })
      .select(['user.id', 'user.username', 'user.fullName', 'user.avatar', 'user.isVerified'])
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return { users, total };
  }

  async searchUsers(getUsersDto: GetUsersDto): Promise<{ users: User[]; total: number }> {
    const { search, page = 1, limit = 10 } = getUsersDto;

    const query = this.userRepository
      .createQueryBuilder('user')
      .select(['user.id', 'user.username', 'user.fullName', 'user.avatar', 'user.isVerified', 'user.followersCount'])
      .where('user.isActive = :isActive', { isActive: true });

    if (search) {
      query.andWhere(
        '(user.username ILIKE :search OR user.fullName ILIKE :search)',
        { search: `%${search}%` }
      );
    }

    query
      .orderBy('user.followersCount', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [users, total] = await query.getManyAndCount();

    return { users, total };
  }
} 