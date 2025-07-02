import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { CommentService } from '../services/comment.service';
import { CreateCommentDto, UpdateCommentDto, GetCommentsDto } from '../dto/comment.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@ApiTags('Comments')
@Controller('videos/:videoId/comments')
export class CommentsController {
  constructor(private readonly commentService: CommentService) {}

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách comments của video' })
  @ApiQuery({ name: 'page', required: false, description: 'Số trang' })
  @ApiQuery({ name: 'limit', required: false, description: 'Số lượng mỗi trang' })
  @ApiQuery({ name: 'parentId', required: false, description: 'ID comment cha (để lấy replies)' })
  @ApiResponse({ status: 200, description: 'Lấy danh sách thành công' })
  async getComments(
    @Param('videoId') videoId: string,
    @Query() getCommentsDto: GetCommentsDto,
  ) {
    return await this.commentService.getComments(videoId, getCommentsDto);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Tạo comment mới' })
  @ApiResponse({ status: 201, description: 'Tạo comment thành công' })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập' })
  @ApiResponse({ status: 404, description: 'Video không tồn tại' })
  async createComment(
    @Param('videoId') videoId: string,
    @Request() req,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    const comment = await this.commentService.createComment(videoId, req.user.id, createCommentDto);
    return { comment };
  }

  @Put(':commentId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cập nhật comment' })
  @ApiResponse({ status: 200, description: 'Cập nhật thành công' })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập' })
  @ApiResponse({ status: 403, description: 'Không có quyền sửa comment này' })
  @ApiResponse({ status: 404, description: 'Comment không tồn tại' })
  async updateComment(
    @Param('commentId') commentId: string,
    @Request() req,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    const comment = await this.commentService.updateComment(commentId, req.user.id, updateCommentDto);
    return { comment };
  }

  @Delete(':commentId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Xóa comment' })
  @ApiResponse({ status: 200, description: 'Xóa thành công' })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập' })
  @ApiResponse({ status: 403, description: 'Không có quyền xóa comment này' })
  @ApiResponse({ status: 404, description: 'Comment không tồn tại' })
  async deleteComment(
    @Param('commentId') commentId: string,
    @Request() req,
  ) {
    await this.commentService.deleteComment(commentId, req.user.id);
    return { message: 'Xóa comment thành công' };
  }

  @Post(':commentId/like')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Like/Unlike comment' })
  @ApiResponse({ status: 200, description: 'Like/Unlike thành công' })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập' })
  @ApiResponse({ status: 404, description: 'Comment không tồn tại' })
  async likeComment(
    @Param('commentId') commentId: string,
    @Request() req,
  ) {
    await this.commentService.likeComment(commentId, req.user.id);
    return { message: 'Like/Unlike thành công' };
  }
} 