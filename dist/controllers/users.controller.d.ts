import { UserService } from '../services/user.service';
import { UpdateProfileDto, GetUsersDto } from '../dto/user.dto';
export declare class UsersController {
    private readonly userService;
    constructor(userService: UserService);
    searchUsers(getUsersDto: GetUsersDto): Promise<{
        users: import("../entities/user.entity").User[];
        total: number;
    }>;
    getUserById(id: string): Promise<{
        user: {
            id: string;
            email: string;
            username: string;
            fullName: string;
            avatar: string;
            bio: string;
            website: string;
            isVerified: boolean;
            isPremium: boolean;
            followersCount: number;
            followingCount: number;
            videosCount: number;
            likesCount: number;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            videos: import("../entities/video.entity").Video[];
            comments: import("../entities/comment.entity").Comment[];
            likes: import("../entities/like.entity").Like[];
            followers: import("../entities/user.entity").User[];
            following: import("../entities/user.entity").User[];
        };
    }>;
    getUserByUsername(username: string): Promise<{
        user: {
            id: string;
            email: string;
            username: string;
            fullName: string;
            avatar: string;
            bio: string;
            website: string;
            isVerified: boolean;
            isPremium: boolean;
            followersCount: number;
            followingCount: number;
            videosCount: number;
            likesCount: number;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            videos: import("../entities/video.entity").Video[];
            comments: import("../entities/comment.entity").Comment[];
            likes: import("../entities/like.entity").Like[];
            followers: import("../entities/user.entity").User[];
            following: import("../entities/user.entity").User[];
        };
    }>;
    updateProfile(req: any, updateProfileDto: UpdateProfileDto): Promise<{
        user: {
            id: string;
            email: string;
            username: string;
            fullName: string;
            avatar: string;
            bio: string;
            website: string;
            isVerified: boolean;
            isPremium: boolean;
            followersCount: number;
            followingCount: number;
            videosCount: number;
            likesCount: number;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            videos: import("../entities/video.entity").Video[];
            comments: import("../entities/comment.entity").Comment[];
            likes: import("../entities/like.entity").Like[];
            followers: import("../entities/user.entity").User[];
            following: import("../entities/user.entity").User[];
        };
    }>;
    followUser(req: any, followingId: string): Promise<{
        message: string;
    }>;
    unfollowUser(req: any, followingId: string): Promise<{
        message: string;
    }>;
    getFollowers(userId: string, page?: number, limit?: number): Promise<{
        users: import("../entities/user.entity").User[];
        total: number;
    }>;
    getFollowing(userId: string, page?: number, limit?: number): Promise<{
        users: import("../entities/user.entity").User[];
        total: number;
    }>;
}
