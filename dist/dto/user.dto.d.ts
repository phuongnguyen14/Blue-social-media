export declare class UpdateProfileDto {
    fullName?: string;
    bio?: string;
    website?: string;
    avatar?: string;
}
export declare class FollowUserDto {
    userId: string;
}
export declare class GetUsersDto {
    search?: string;
    page?: number;
    limit?: number;
}
