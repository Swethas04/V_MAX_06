import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User } from '../users/user.entity';
import { SendOtpDto, VerifyOtpDto, SelectRoleDto } from './dto/auth.dto';
export declare class AuthService {
    private readonly userRepo;
    private readonly jwtService;
    private readonly configService;
    private readonly logger;
    constructor(userRepo: Repository<User>, jwtService: JwtService, configService: ConfigService);
    sendOtp(dto: SendOtpDto): Promise<{
        message: string;
    }>;
    verifyOtp(dto: VerifyOtpDto): Promise<{
        accessToken: string;
        user: Partial<User>;
        isNewUser: boolean;
    }>;
    selectRole(userId: string, dto: SelectRoleDto): Promise<{
        accessToken: string;
        user: Partial<User>;
    }>;
    getProfile(userId: string): Promise<Partial<User>>;
    updateFcmToken(userId: string, fcmToken: string): Promise<void>;
    private generateOtp;
    private issueToken;
    private sanitizeUser;
    private sendSmsStub;
}
