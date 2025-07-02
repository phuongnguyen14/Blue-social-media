export declare class RegisterDto {
    email: string;
    username: string;
    password: string;
    fullName?: string;
}
export declare class LoginDto {
    emailOrUsername: string;
    password: string;
}
export declare class ForgotPasswordDto {
    email: string;
}
export declare class ResetPasswordDto {
    token: string;
    newPassword: string;
}
export declare class ChangePasswordDto {
    currentPassword: string;
    newPassword: string;
}
