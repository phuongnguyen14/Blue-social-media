import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { VideoService } from '../services/video.service';
import { CreateVideoDto, UpdateVideoDto, GetVideosDto } from '../dto/video.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../guards/optional-auth.guard';

@ApiTags('Videos')
@Controller('videos')
export class VideosController {
  constructor(private readonly videoService: VideoService) {}

  @Get()
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'Lấy danh sách videos' })
  @ApiQuery({ name: 'search', required: false, description: 'Từ khóa tìm kiếm' })
  @ApiQuery({ name: 'category', required: false, description: 'Danh mục' })
  @ApiQuery({ name: 'userId', required: false, description: 'ID người dùng' })
  @ApiQuery({ name: 'page', required: false, description: 'Số trang' })
  @ApiQuery({ name: 'limit', required: false, description: 'Số lượng mỗi trang' })
  @ApiQuery({ name: 'sortBy', required: false, description: 'Sắp xếp theo', enum: ['createdAt', 'viewsCount', 'likesCount'] })
  @ApiQuery({ name: 'sortOrder', required: false, description: 'Thứ tự sắp xếp', enum: ['ASC', 'DESC'] })
  @ApiResponse({ status: 200, description: 'Lấy danh sách thành công' })
  async getVideos(@Query() getVideosDto: GetVideosDto, @Request() req) {
    const userId = req.user?.id;
    return await this.videoService.getVideos(getVideosDto, userId);
  }

  @Get('trending')
  @ApiOperation({ summary: 'Lấy videos trending' })
  @ApiQuery({ name: 'limit', required: false, description: 'Số lượng videos' })
  @ApiResponse({ status: 200, description: 'Lấy danh sách thành công' })
  async getTrendingVideos(@Query('limit') limit: number = 20) {
    const videos = await this.videoService.getTrendingVideos(limit);
    return { videos };
  }

  @Get('recommended')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lấy videos đề xuất cho người dùng' })
  @ApiQuery({ name: 'limit', required: false, description: 'Số lượng videos' })
  @ApiResponse({ status: 200, description: 'Lấy danh sách thành công' })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập' })
  async getRecommendedVideos(@Request() req, @Query('limit') limit: number = 20) {
    const videos = await this.videoService.getRecommendedVideos(req.user.id, limit);
    return { videos };
  }

  @Get(':id')
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'Lấy thông tin video theo ID' })
  @ApiResponse({ status: 200, description: 'Lấy thông tin thành công' })
  @ApiResponse({ status: 404, description: 'Video không tồn tại' })
  @ApiResponse({ status: 403, description: 'Cần tài khoản premium để xem video này' })
  async getVideoById(@Param('id') id: string, @Request() req) {
    const userId = req.user?.id;
    const video = await this.videoService.findById(id, userId);
    return { video };
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Tạo video mới' })
  @ApiResponse({ status: 201, description: 'Tạo video thành công' })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập' })
  async createVideo(@Request() req, @Body() createVideoDto: CreateVideoDto) {
    const video = await this.videoService.createVideo(req.user.id, createVideoDto);
    return { video };
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cập nhật video' })
  @ApiResponse({ status: 200, description: 'Cập nhật thành công' })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập' })
  @ApiResponse({ status: 403, description: 'Không có quyền sửa video này' })
  @ApiResponse({ status: 404, description: 'Video không tồn tại' })
  async updateVideo(
    @Param('id') videoId: string,
    @Request() req,
    @Body() updateVideoDto: UpdateVideoDto,
  ) {
    const video = await this.videoService.updateVideo(videoId, req.user.id, updateVideoDto);
    return { video };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Xóa video' })
  @ApiResponse({ status: 200, description: 'Xóa thành công' })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập' })
  @ApiResponse({ status: 403, description: 'Không có quyền xóa video này' })
  @ApiResponse({ status: 404, description: 'Video không tồn tại' })
  async deleteVideo(@Param('id') videoId: string, @Request() req) {
    await this.videoService.deleteVideo(videoId, req.user.id);
    return { message: 'Xóa video thành công' };
  }

  @Post(':id/like')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Like/Unlike video' })
  @ApiResponse({ status: 200, description: 'Like/Unlike thành công' })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập' })
  @ApiResponse({ status: 404, description: 'Video không tồn tại' })
  async likeVideo(@Param('id') videoId: string, @Request() req) {
    await this.videoService.likeVideo(videoId, req.user.id);
    return { message: 'Like/Unlike thành công' };
  }
} 