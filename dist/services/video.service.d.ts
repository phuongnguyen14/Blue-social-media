import { Repository } from 'typeorm';
import { Video } from '../entities/video.entity';
import { Like } from '../entities/like.entity';
import { User } from '../entities/user.entity';
import { CreateVideoDto, UpdateVideoDto, GetVideosDto } from '../dto/video.dto';
export declare class VideoService {
    private videoRepository;
    private likeRepository;
    private userRepository;
    constructor(videoRepository: Repository<Video>, likeRepository: Repository<Like>, userRepository: Repository<User>);
    createVideo(userId: string, createVideoDto: CreateVideoDto): Promise<Video>;
    findById(id: string, userId?: string): Promise<Video>;
    getVideos(getVideosDto: GetVideosDto, userId?: string): Promise<{
        videos: Video[];
        total: number;
    }>;
    updateVideo(videoId: string, userId: string, updateVideoDto: UpdateVideoDto): Promise<Video>;
    deleteVideo(videoId: string, userId: string): Promise<void>;
    likeVideo(videoId: string, userId: string): Promise<void>;
    getTrendingVideos(limit?: number): Promise<Video[]>;
    getRecommendedVideos(userId: string, limit?: number): Promise<Video[]>;
}
