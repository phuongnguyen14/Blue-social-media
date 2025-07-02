import { VideoService } from '../services/video.service';
import { CreateVideoDto, UpdateVideoDto, GetVideosDto } from '../dto/video.dto';
export declare class VideosController {
    private readonly videoService;
    constructor(videoService: VideoService);
    getVideos(getVideosDto: GetVideosDto, req: any): Promise<{
        videos: import("../entities/video.entity").Video[];
        total: number;
    }>;
    getTrendingVideos(limit?: number): Promise<{
        videos: import("../entities/video.entity").Video[];
    }>;
    getRecommendedVideos(req: any, limit?: number): Promise<{
        videos: import("../entities/video.entity").Video[];
    }>;
    getVideoById(id: string, req: any): Promise<{
        video: import("../entities/video.entity").Video;
    }>;
    createVideo(req: any, createVideoDto: CreateVideoDto): Promise<{
        video: import("../entities/video.entity").Video;
    }>;
    updateVideo(videoId: string, req: any, updateVideoDto: UpdateVideoDto): Promise<{
        video: import("../entities/video.entity").Video;
    }>;
    deleteVideo(videoId: string, req: any): Promise<{
        message: string;
    }>;
    likeVideo(videoId: string, req: any): Promise<{
        message: string;
    }>;
}
