import { AuthService } from '../services/auth.service';
import { RegisterDto, LoginDto, ChangePasswordDto } from '../dto/auth.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    healthCheck(): Promise<any>;
    register(registerDto: RegisterDto): Promise<{
        user: Partial<import("../entities/user.entity").User>;
        access_token: string;
    }>;
    login(loginDto: LoginDto): Promise<{
        user: Partial<import("../entities/user.entity").User>;
        access_token: string;
    }>;
    getProfile(req: any): Promise<{
        user: any;
    }>;
    changePassword(req: any, changePasswordDto: ChangePasswordDto): Promise<{
        message: string;
    }>;
}
