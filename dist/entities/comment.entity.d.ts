import { User } from './user.entity';
import { Video } from './video.entity';
export declare class Comment {
    id: string;
    content: string;
    likesCount: number;
    parentId: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    videoId: string;
    user: User;
    video: Video;
    parent: Comment;
    replies: Comment[];
}
