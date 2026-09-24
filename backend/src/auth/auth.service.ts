import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User, UserRole, Language } from '../users/user.entity';
import { SendOtpDto, VerifyOtpDto, SelectRoleDto } from './dto/auth.dto';
import { JwtPayload } from './jwt.strategy';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  /** Step 1: Generate and send OTP */
  async sendOtp(dto: SendOtpDto): Promise<{ message: string; mockOtp?: string }> {
    const isMock = this.configService.get<boolean>('otp.mockMode');
    const otp = this.generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Upsert user by phone (creates if not exists)
    let user = await this.userRepo.findOne({ where: { phone: dto.phone } });
    if (!user) {
      user = this.userRepo.create({ phone: dto.phone, name: 'New User' });
    }
    user.otpCode = otp;
    user.otpExpiresAt = expiresAt;
    await this.userRepo.save(user);

    if (isMock) {
      this.logger.log(`[MOCK OTP] Phone: ${dto.phone} → OTP: ${otp}`);
      return { message: 'OTP sent (MOCK mode)', mockOtp: otp };
    }

    // Real SMS: stub for MSG91 / Twilio
    await this.sendSmsStub(dto.phone, otp);
    return { message: 'OTP sent successfully' };
  }

  /** Step 2: Verify OTP and issue JWT */
  async verifyOtp(dto: VerifyOtpDto): Promise<{ accessToken: string; user: Partial<User>; isNewUser: boolean }> {
    const user = await this.userRepo.findOne({ where: { phone: dto.phone } });

    if (!user) {
      throw new UnauthorizedException('Phone number not registered. Call /auth/send-otp first.');
    }

    const isMock = this.configService.get<boolean>('otp.mockMode');

    if (isMock) {
      // In mock mode: accept the stored OTP OR any 6-digit code
      if (user.otpCode !== dto.otp && !/^\d{6}$/.test(dto.otp)) {
        throw new UnauthorizedException('Invalid OTP');
      }
    } else {
      if (user.otpCode !== dto.otp) {
        throw new UnauthorizedException('Invalid OTP');
      }
      if (!user.otpExpiresAt || user.otpExpiresAt < new Date()) {
        throw new UnauthorizedException('OTP expired. Request a new one.');
      }
    }

    const isNewUser = !user.isVerified;

    // Update user
    user.isVerified = true;
    user.otpCode = null;
    user.otpExpiresAt = null;
    if (dto.name && dto.name.trim().length > 0) {
      user.name = dto.name.trim();
    }
    await this.userRepo.save(user);

    const token = this.issueToken(user);
    return {
      accessToken: token,
      isNewUser,
      user: this.sanitizeUser(user),
    };
  }

  /** Step 3: Select role (called after first login) */
  async selectRole(userId: string, dto: SelectRoleDto): Promise<{ accessToken: string; user: Partial<User> }> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new BadRequestException('User not found');

    const allowedRoles = Object.values(UserRole);
    if (!allowedRoles.includes(dto.role as UserRole)) {
      throw new BadRequestException(`Invalid role. Allowed: ${allowedRoles.join(', ')}`);
    }

    user.role = dto.role as UserRole;
    if (dto.orgAffiliation) user.orgAffiliation = dto.orgAffiliation;
    await this.userRepo.save(user);

    // Re-issue token with updated role
    const token = this.issueToken(user);
    return { accessToken: token, user: this.sanitizeUser(user) };
  }

  /** Get authenticated user's profile */
  async getProfile(userId: string): Promise<Partial<User>> {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: { institution: true },
    });
    if (!user) throw new UnauthorizedException('User not found');
    return this.sanitizeUser(user);
  }

  /** Update FCM token */
  async updateFcmToken(userId: string, fcmToken: string): Promise<void> {
    await this.userRepo.update(userId, { fcmToken });
  }

  // ─── Private helpers ─────────────────────────────────────────

  private generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  private issueToken(user: User): string {
    const payload: JwtPayload = { sub: user.id, phone: user.phone, role: user.role };
    return this.jwtService.sign(payload);
  }

  private sanitizeUser(user: User): Partial<User> {
    const { otpCode, otpExpiresAt, ...safe } = user as any;
    return safe;
  }

  private async sendSmsStub(phone: string, otp: string): Promise<void> {
    // TODO: Replace with MSG91 / Twilio SDK call
    // Example MSG91:
    // await msg91.sendOTP({ mobile: `91${phone}`, otp });
    this.logger.warn(`[SMS STUB] Would send OTP ${otp} to ${phone}`);
  }
}
