import { AuthService } from './auth.service';
import { SendOtpDto, VerifyOtpDto, SelectRoleDto } from './dto/auth.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    sendOtp(dto: SendOtpDto): Promise<{
        message: string;
    }>;
    verifyOtp(dto: VerifyOtpDto): Promise<{
        accessToken: string;
        user: Partial<import("../users/user.entity").User>;
        isNewUser: boolean;
    }>;
    selectRole(req: any, dto: SelectRoleDto): Promise<{
        accessToken: string;
        user: Partial<import("../users/user.entity").User>;
    }>;
    getProfile(req: any): Promise<Partial<import("../users/user.entity").User>>;
    updateFcmToken(req: any, body: {
        fcmToken: string;
    }): Promise<void>;
}
