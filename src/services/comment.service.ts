import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from '../entities/comment.entity';
import { Video } from '../entities/video.entity';
import { Like, LikeType } from '../entities/like.entity';
import { CreateCommentDto, UpdateCommentDto, GetCommentsDto } from '../dto/comment.dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    @InjectRepository(Video)
    private videoRepository: Repository<Video>,
    @InjectRepository(Like)
    private likeRepository: Repository<Like>,
  ) {}

  async createComment(videoId: string, userId: string, createCommentDto: CreateCommentDto): Promise<Comment> {
    const { content, parentId } = createCommentDto;

    // Check if video exists
    const video = await this.videoRepository.findOne({ where: { id: videoId } });
    if (!video) {
      throw new NotFoundException('Video không tồn tại');
    }

    // Check if parent comment exists (for replies)
    if (parentId) {
      const parentComment = await this.commentRepository.findOne({ where: { id: parentId, videoId } });
      if (!parentComment) {
        throw new NotFoundException('Comment cha không tồn tại');
      }
    }

    const newComment = this.commentRepository.create({
      content,
      videoId,
      userId,
      parentId,
    });

    const savedComment = await this.commentRepository.save(newComment);

    // Update video comments count
    await this.videoRepository.increment({ id: videoId }, 'commentsCount', 1);

    const savedCommentWithRelations = await this.commentRepository.findOne({
      where: { id: savedComment.id },
      relations: ['user', 'replies', 'replies.user'],
    });

    if (!savedCommentWithRelations) {
      throw new NotFoundException('Comment vừa tạo không tìm thấy');
    }

    return savedCommentWithRelations;
  }

  async getComments(videoId: string, getCommentsDto: GetCommentsDto): Promise<{ comments: Comment[]; total: number }> {
    const { page = 1, limit = 20, parentId } = getCommentsDto;

    const query = this.commentRepository
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.user', 'user')
      .leftJoinAndSelect('comment.replies', 'replies')
      .leftJoinAndSelect('replies.user', 'repliesUser')
      .where('comment.videoId = :videoId', { videoId });

    if (parentId) {
      query.andWhere('comment.parentId = :parentId', { parentId });
    } else {
      query.andWhere('comment.parentId IS NULL');
    }

    query
      .orderBy('comment.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [comments, total] = await query.getManyAndCount();

    return { comments, total };
  }

  async updateComment(commentId: string, userId: string, updateCommentDto: UpdateCommentDto): Promise<Comment> {
    const comment = await this.commentRepository.findOne({
      where: { id: commentId },
      relations: ['user'],
    });

    if (!comment) {
      throw new NotFoundException('Comment không tồn tại');
    }

    if (comment.userId !== userId) {
      throw new ForbiddenException('Bạn không có quyền sửa comment này');
    }

    comment.content = updateCommentDto.content;
    
    return await this.commentRepository.save(comment);
  }

  async deleteComment(commentId: string, userId: string): Promise<void> {
    const comment = await this.commentRepository.findOne({
      where: { id: commentId },
    });

    if (!comment) {
      throw new NotFoundException('Comment không tồn tại');
    }

    if (comment.userId !== userId) {
      throw new ForbiddenException('Bạn không có quyền xóa comment này');
    }

    // Delete comment and its replies (cascade)
    await this.commentRepository.remove(comment);

    // Update video comments count
    await this.videoRepository.decrement({ id: comment.videoId }, 'commentsCount', 1);
  }

  async likeComment(commentId: string, userId: string): Promise<void> {
    const comment = await this.commentRepository.findOne({ where: { id: commentId } });
    if (!comment) {
      throw new NotFoundException('Comment không tồn tại');
    }

    // Check if already liked
    const existingLike = await this.likeRepository.findOne({
      where: { commentId, userId, type: LikeType.COMMENT },
    });

    if (existingLike) {
      // Unlike
      await this.likeRepository.remove(existingLike);
      await this.commentRepository.decrement({ id: commentId }, 'likesCount', 1);
    } else {
      // Like
      const like = this.likeRepository.create({
        commentId,
        userId,
        type: LikeType.COMMENT,
      });
      await this.likeRepository.save(like);
      await this.commentRepository.increment({ id: commentId }, 'likesCount', 1);
    }
  }
} 