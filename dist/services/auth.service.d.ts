import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { RegisterDto, LoginDto, ChangePasswordDto } from '../dto/auth.dto';
export declare class AuthService {
    private userRepository;
    private jwtService;
    private readonly logger;
    constructor(userRepository: Repository<User>, jwtService: JwtService);
    register(registerDto: RegisterDto): Promise<{
        user: Partial<User>;
        access_token: string;
    }>;
    login(loginDto: LoginDto): Promise<{
        user: Partial<User>;
        access_token: string;
    }>;
    validateUser(userId: string): Promise<User>;
    changePassword(userId: string, changePasswordDto: ChangePasswordDto): Promise<void>;
    testDatabaseConnection(): Promise<any>;
}
