import { User } from './user.entity';
import { Comment } from './comment.entity';
import { Like } from './like.entity';
export declare class Video {
    id: string;
    title: string;
    description: string;
    videoUrl: string;
    thumbnailUrl: string;
    duration: number;
    viewsCount: number;
    likesCount: number;
    commentsCount: number;
    sharesCount: number;
    tags: string[];
    isPublic: boolean;
    isPremium: boolean;
    category: string;
    metadata: any;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    user: User;
    comments: Comment[];
    likes: Like[];
}
