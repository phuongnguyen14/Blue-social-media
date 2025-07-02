import { CommentService } from '../services/comment.service';
import { CreateCommentDto, UpdateCommentDto, GetCommentsDto } from '../dto/comment.dto';
export declare class CommentsController {
    private readonly commentService;
    constructor(commentService: CommentService);
    getComments(videoId: string, getCommentsDto: GetCommentsDto): Promise<{
        comments: import("../entities/comment.entity").Comment[];
        total: number;
    }>;
    createComment(videoId: string, req: any, createCommentDto: CreateCommentDto): Promise<{
        comment: import("../entities/comment.entity").Comment;
    }>;
    updateComment(commentId: string, req: any, updateCommentDto: UpdateCommentDto): Promise<{
        comment: import("../entities/comment.entity").Comment;
    }>;
    deleteComment(commentId: string, req: any): Promise<{
        message: string;
    }>;
    likeComment(commentId: string, req: any): Promise<{
        message: string;
    }>;
}
