import { User } from './user.entity';
import { Video } from './video.entity';
import { Comment } from './comment.entity';
export declare enum LikeType {
    VIDEO = "video",
    COMMENT = "comment"
}
export declare class Like {
    id: string;
    type: LikeType;
    createdAt: Date;
    userId: string;
    videoId: string;
    commentId: string;
    user: User;
    video: Video;
    comment: Comment;
}
