import { Injectable, UnauthorizedException, ConflictException, NotFoundException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../entities/user.entity';
import { RegisterDto, LoginDto, ChangePasswordDto } from '../dto/auth.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<{ user: Partial<User>; access_token: string }> {
    try {
      this.logger.log('🚀 Starting user registration...');
      const { email, username, password, fullName } = registerDto;
      
      this.logger.log(`📧 Checking existing user for email: ${email}, username: ${username}`);

      // Check if user already exists
      const existingUser = await this.userRepository.findOne({
        where: [{ email }, { username }],
      });

      if (existingUser) {
        this.logger.warn(`❌ User already exists: ${existingUser.email || existingUser.username}`);
        throw new ConflictException('Email hoặc username đã tồn tại');
      }

      this.logger.log('🔒 Hashing password...');
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12);

      this.logger.log('👤 Creating user entity...');
      // Create user
      const user = this.userRepository.create({
        email,
        username,
        password: hashedPassword,
        fullName,
      });

      this.logger.log('💾 Saving user to database...');
      const savedUser = await this.userRepository.save(user);
      this.logger.log(`✅ User saved successfully with ID: ${savedUser.id}`);

      this.logger.log('🎫 Generating JWT token...');
      // Generate JWT token
      const payload = { sub: savedUser.id, email: savedUser.email, username: savedUser.username };
      const access_token = this.jwtService.sign(payload);

      // Remove password from response
      const { password: _, ...userResponse } = savedUser;

      this.logger.log('🎉 Registration completed successfully!');
      return {
        user: userResponse,
        access_token,
      };
    } catch (error) {
      this.logger.error('💥 Registration error:', error);
      this.logger.error('Error stack:', error.stack);
      throw error;
    }
  }

  async login(loginDto: LoginDto): Promise<{ user: Partial<User>; access_token: string }> {
    const { emailOrUsername, password } = loginDto;

    // Find user by email or username
    const user = await this.userRepository.findOne({
      where: [
        { email: emailOrUsername },
        { username: emailOrUsername },
      ],
    });

    if (!user) {
      throw new UnauthorizedException('Thông tin đăng nhập không hợp lệ');
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Thông tin đăng nhập không hợp lệ');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Tài khoản đã bị khóa');
    }

    // Generate JWT token
    const payload = { sub: user.id, email: user.email, username: user.username };
    const access_token = this.jwtService.sign(payload);

    // Remove password from response
    const { password: _, ...userResponse } = user;

    return {
      user: userResponse,
      access_token,
    };
  }

  async validateUser(userId: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId, isActive: true },
    });

    if (!user) {
      throw new UnauthorizedException('Người dùng không tồn tại');
    }

    return user;
  }

  async changePassword(userId: string, changePasswordDto: ChangePasswordDto): Promise<void> {
    const { currentPassword, newPassword } = changePasswordDto;
    
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('Người dùng không tồn tại');
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      throw new UnauthorizedException('Mật khẩu hiện tại không đúng');
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 12);
    
    // Update password
    await this.userRepository.update(userId, { password: hashedNewPassword });
  }

  async testDatabaseConnection(): Promise<any> {
    try {
      this.logger.log('🔍 Testing database connection...');
      
      // Test basic query
      const result = await this.userRepository.query('SELECT 1 as test');
      this.logger.log('✅ Database query successful:', result);
      
      // Test if users table exists and accessible
      const userCount = await this.userRepository.count();
      this.logger.log(`👥 User count: ${userCount}`);
      
      // Test environment variables
      const envVars = {
        NODE_ENV: process.env.NODE_ENV,
        DATABASE_URL: process.env.DATABASE_URL ? 'SET' : 'MISSING',
        JWT_SECRET: process.env.JWT_SECRET ? 'SET' : 'MISSING'
      };
      this.logger.log('🔐 Environment variables:', envVars);
      
      return {
        status: 'success',
        database: 'connected',
        userCount,
        envVars,
        timestamp: new Date().toISOString()
      };
      
    } catch (error) {
      this.logger.error('💥 Database test failed:', error);
      throw error;
    }
  }
} 