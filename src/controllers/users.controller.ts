import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { UserService } from '../services/user.service';
import { UpdateProfileDto, GetUsersDto } from '../dto/user.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @Get('search')
  @ApiOperation({ summary: 'Tìm kiếm người dùng' })
  @ApiQuery({ name: 'search', required: false, description: 'Từ khóa tìm kiếm' })
  @ApiQuery({ name: 'page', required: false, description: 'Số trang' })
  @ApiQuery({ name: 'limit', required: false, description: 'Số lượng mỗi trang' })
  @ApiResponse({ status: 200, description: 'Tìm kiếm thành công' })
  async searchUsers(@Query() getUsersDto: GetUsersDto) {
    return await this.userService.searchUsers(getUsersDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin người dùng theo ID' })
  @ApiResponse({ status: 200, description: 'Lấy thông tin thành công' })
  @ApiResponse({ status: 404, description: 'Người dùng không tồn tại' })
  async getUserById(@Param('id') id: string) {
    const user = await this.userService.findById(id);
    const { password, ...userResponse } = user;
    return { user: userResponse };
  }

  @Get('username/:username')
  @ApiOperation({ summary: 'Lấy thông tin người dùng theo username' })
  @ApiResponse({ status: 200, description: 'Lấy thông tin thành công' })
  @ApiResponse({ status: 404, description: 'Người dùng không tồn tại' })
  async getUserByUsername(@Param('username') username: string) {
    const user = await this.userService.findByUsername(username);
    const { password, ...userResponse } = user;
    return { user: userResponse };
  }

  @Put('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cập nhật thông tin profile' })
  @ApiResponse({ status: 200, description: 'Cập nhật thành công' })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập' })
  async updateProfile(@Request() req, @Body() updateProfileDto: UpdateProfileDto) {
    const user = await this.userService.updateProfile(req.user.id, updateProfileDto);
    const { password, ...userResponse } = user;
    return { user: userResponse };
  }

  @Post(':id/follow')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Follow người dùng' })
  @ApiResponse({ status: 200, description: 'Follow thành công' })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập' })
  @ApiResponse({ status: 404, description: 'Người dùng không tồn tại' })
  @ApiResponse({ status: 409, description: 'Đã follow người dùng này' })
  async followUser(@Request() req, @Param('id') followingId: string) {
    await this.userService.followUser(req.user.id, followingId);
    return { message: 'Follow thành công' };
  }

  @Delete(':id/follow')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Unfollow người dùng' })
  @ApiResponse({ status: 200, description: 'Unfollow thành công' })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập' })
  @ApiResponse({ status: 404, description: 'Người dùng không tồn tại' })
  async unfollowUser(@Request() req, @Param('id') followingId: string) {
    await this.userService.unfollowUser(req.user.id, followingId);
    return { message: 'Unfollow thành công' };
  }

  @Get(':id/followers')
  @ApiOperation({ summary: 'Lấy danh sách followers' })
  @ApiQuery({ name: 'page', required: false, description: 'Số trang' })
  @ApiQuery({ name: 'limit', required: false, description: 'Số lượng mỗi trang' })
  @ApiResponse({ status: 200, description: 'Lấy danh sách thành công' })
  async getFollowers(
    @Param('id') userId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ) {
    return await this.userService.getFollowers(userId, page, limit);
  }

  @Get(':id/following')
  @ApiOperation({ summary: 'Lấy danh sách following' })
  @ApiQuery({ name: 'page', required: false, description: 'Số trang' })
  @ApiQuery({ name: 'limit', required: false, description: 'Số lượng mỗi trang' })
  @ApiResponse({ status: 200, description: 'Lấy danh sách thành công' })
  async getFollowing(
    @Param('id') userId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ) {
    return await this.userService.getFollowing(userId, page, limit);
  }
} 