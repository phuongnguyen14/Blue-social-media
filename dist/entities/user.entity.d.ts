import { Video } from './video.entity';
import { Comment } from './comment.entity';
import { Like } from './like.entity';
export declare class User {
    id: string;
    email: string;
    username: string;
    password: string;
    fullName: string;
    avatar: string;
    bio: string;
    website: string;
    isVerified: boolean;
    isPremium: boolean;
    followersCount: number;
    followingCount: number;
    videosCount: number;
    likesCount: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    videos: Video[];
    comments: Comment[];
    likes: Like[];
    followers: User[];
    following: User[];
}
