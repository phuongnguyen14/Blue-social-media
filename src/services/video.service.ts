import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Video } from '../entities/video.entity';
import { Like, LikeType } from '../entities/like.entity';
import { User } from '../entities/user.entity';
import { CreateVideoDto, UpdateVideoDto, GetVideosDto } from '../dto/video.dto';

@Injectable()
export class VideoService {
  constructor(
    @InjectRepository(Video)
    private videoRepository: Repository<Video>,
    @InjectRepository(Like)
    private likeRepository: Repository<Like>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createVideo(userId: string, createVideoDto: CreateVideoDto): Promise<Video> {
    const video = this.videoRepository.create({
      ...createVideoDto,
      userId,
    });

    const savedVideo = await this.videoRepository.save(video);

    // Update user's videos count
    await this.userRepository.increment({ id: userId }, 'videosCount', 1);

    const videoWithUser = await this.videoRepository.findOne({
      where: { id: savedVideo.id },
      relations: ['user'],
    });

    if (!videoWithUser) {
      throw new NotFoundException('Video vừa tạo không tìm thấy');
    }

    return videoWithUser;
  }

  async findById(id: string, userId?: string): Promise<Video> {
    const video = await this.videoRepository.findOne({
      where: { id },
      relations: ['user', 'comments', 'comments.user'],
    });

    if (!video) {
      throw new NotFoundException('Video không tồn tại');
    }

    // Check if user can access premium content
    if (video.isPremium && userId) {
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user?.isPremium && video.userId !== userId) {
        throw new ForbiddenException('Cần tài khoản premium để xem video này');
      }
    }

    // Increment view count
    await this.videoRepository.increment({ id }, 'viewsCount', 1);

    return video;
  }

  async getVideos(getVideosDto: GetVideosDto, userId?: string): Promise<{ videos: Video[]; total: number }> {
    const { search, category, userId: authorId, page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'DESC' } = getVideosDto;

    const query = this.videoRepository
      .createQueryBuilder('video')
      .leftJoinAndSelect('video.user', 'user')
      .where('video.isPublic = :isPublic', { isPublic: true });

    // Filter premium content for non-premium users
    if (userId) {
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user?.isPremium) {
        query.andWhere('(video.isPremium = :isPremium OR video.userId = :userId)', 
          { isPremium: false, userId });
      }
    } else {
      query.andWhere('video.isPremium = :isPremium', { isPremium: false });
    }

    if (search) {
      query.andWhere(
        '(video.title ILIKE :search OR video.description ILIKE :search OR :search = ANY(video.tags))',
        { search: `%${search}%` }
      );
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

  async updateVideo(videoId: string, userId: string, updateVideoDto: UpdateVideoDto): Promise<Video> {
    const video = await this.findById(videoId);

    if (video.userId !== userId) {
      throw new ForbiddenException('Bạn không có quyền sửa video này');
    }

    Object.assign(video, updateVideoDto);
    
    return await this.videoRepository.save(video);
  }

  async deleteVideo(videoId: string, userId: string): Promise<void> {
    const video = await this.findById(videoId);

    if (video.userId !== userId) {
      throw new ForbiddenException('Bạn không có quyền xóa video này');
    }

    await this.videoRepository.remove(video);

    // Update user's videos count
    await this.userRepository.decrement({ id: userId }, 'videosCount', 1);
  }

  async likeVideo(videoId: string, userId: string): Promise<void> {
    const video = await this.findById(videoId);

    // Check if already liked
    const existingLike = await this.likeRepository.findOne({
      where: { videoId, userId, type: LikeType.VIDEO },
    });

    if (existingLike) {
      // Unlike
      await this.likeRepository.remove(existingLike);
      await this.videoRepository.decrement({ id: videoId }, 'likesCount', 1);
    } else {
      // Like
      const like = this.likeRepository.create({
        videoId,
        userId,
        type: LikeType.VIDEO,
      });
      await this.likeRepository.save(like);
      await this.videoRepository.increment({ id: videoId }, 'likesCount', 1);
    }
  }

  async getTrendingVideos(limit: number = 20): Promise<Video[]> {
    return await this.videoRepository
      .createQueryBuilder('video')
      .leftJoinAndSelect('video.user', 'user')
      .where('video.isPublic = :isPublic', { isPublic: true })
      .andWhere('video.isPremium = :isPremium', { isPremium: false })
      .andWhere('video.createdAt >= :date', { date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }) // Last 7 days
      .orderBy('video.viewsCount + video.likesCount * 2', 'DESC')
      .limit(limit)
      .getMany();
  }

  async getRecommendedVideos(userId: string, limit: number = 20): Promise<Video[]> {
    // Simple recommendation: videos from followed users + trending
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
} 