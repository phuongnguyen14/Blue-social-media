import { Repository } from 'typeorm';
import { Comment } from '../entities/comment.entity';
import { Video } from '../entities/video.entity';
import { Like } from '../entities/like.entity';
import { CreateCommentDto, UpdateCommentDto, GetCommentsDto } from '../dto/comment.dto';
export declare class CommentService {
    private commentRepository;
    private videoRepository;
    private likeRepository;
    constructor(commentRepository: Repository<Comment>, videoRepository: Repository<Video>, likeRepository: Repository<Like>);
    createComment(videoId: string, userId: string, createCommentDto: CreateCommentDto): Promise<Comment>;
    getComments(videoId: string, getCommentsDto: GetCommentsDto): Promise<{
        comments: Comment[];
        total: number;
    }>;
    updateComment(commentId: string, userId: string, updateCommentDto: UpdateCommentDto): Promise<Comment>;
    deleteComment(commentId: string, userId: string): Promise<void>;
    likeComment(commentId: string, userId: string): Promise<void>;
}
