import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { UpdateProfileDto, GetUsersDto } from '../dto/user.dto';
export declare class UserService {
    private userRepository;
    constructor(userRepository: Repository<User>);
    findById(id: string): Promise<User>;
    findByUsername(username: string): Promise<User>;
    updateProfile(userId: string, updateProfileDto: UpdateProfileDto): Promise<User>;
    followUser(followerId: string, followingId: string): Promise<void>;
    unfollowUser(followerId: string, followingId: string): Promise<void>;
    getFollowers(userId: string, page?: number, limit?: number): Promise<{
        users: User[];
        total: number;
    }>;
    getFollowing(userId: string, page?: number, limit?: number): Promise<{
        users: User[];
        total: number;
    }>;
    searchUsers(getUsersDto: GetUsersDto): Promise<{
        users: User[];
        total: number;
    }>;
}
