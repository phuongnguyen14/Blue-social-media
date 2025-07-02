export declare class CreateVideoDto {
    title: string;
    description?: string;
    videoUrl: string;
    thumbnailUrl?: string;
    duration?: number;
    tags?: string[];
    isPublic?: boolean;
    isPremium?: boolean;
    category?: string;
}
export declare class UpdateVideoDto {
    title?: string;
    description?: string;
    thumbnailUrl?: string;
    tags?: string[];
    isPublic?: boolean;
    isPremium?: boolean;
    category?: string;
}
export declare class GetVideosDto {
    search?: string;
    category?: string;
    userId?: string;
    page?: number;
    limit?: number;
    sortBy?: 'createdAt' | 'viewsCount' | 'likesCount';
    sortOrder?: 'ASC' | 'DESC';
}
