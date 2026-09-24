"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const user_entity_1 = require("../users/user.entity");
let AuthService = AuthService_1 = class AuthService {
    constructor(userRepo, jwtService, configService) {
        this.userRepo = userRepo;
        this.jwtService = jwtService;
        this.configService = configService;
        this.logger = new common_1.Logger(AuthService_1.name);
    }
    async sendOtp(dto) {
        const isMock = this.configService.get('otp.mockMode');
        const otp = this.generateOtp();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
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
        await this.sendSmsStub(dto.phone, otp);
        return { message: 'OTP sent successfully' };
    }
    async verifyOtp(dto) {
        const user = await this.userRepo.findOne({ where: { phone: dto.phone } });
        if (!user) {
            throw new common_1.UnauthorizedException('Phone number not registered. Call /auth/send-otp first.');
        }
        const isMock = this.configService.get('otp.mockMode');
        if (isMock) {
            if (user.otpCode !== dto.otp && !/^\d{6}$/.test(dto.otp)) {
                throw new common_1.UnauthorizedException('Invalid OTP');
            }
        }
        else {
            if (user.otpCode !== dto.otp) {
                throw new common_1.UnauthorizedException('Invalid OTP');
            }
            if (!user.otpExpiresAt || user.otpExpiresAt < new Date()) {
                throw new common_1.UnauthorizedException('OTP expired. Request a new one.');
            }
        }
        const isNewUser = !user.isVerified;
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
    async selectRole(userId, dto) {
        const user = await this.userRepo.findOne({ where: { id: userId } });
        if (!user)
            throw new common_1.BadRequestException('User not found');
        const allowedRoles = Object.values(user_entity_1.UserRole);
        if (!allowedRoles.includes(dto.role)) {
            throw new common_1.BadRequestException(`Invalid role. Allowed: ${allowedRoles.join(', ')}`);
        }
        user.role = dto.role;
        if (dto.orgAffiliation)
            user.orgAffiliation = dto.orgAffiliation;
        await this.userRepo.save(user);
        const token = this.issueToken(user);
        return { accessToken: token, user: this.sanitizeUser(user) };
    }
    async getProfile(userId) {
        const user = await this.userRepo.findOne({
            where: { id: userId },
            relations: { institution: true },
        });
        if (!user)
            throw new common_1.UnauthorizedException('User not found');
        return this.sanitizeUser(user);
    }
    async updateFcmToken(userId, fcmToken) {
        await this.userRepo.update(userId, { fcmToken });
    }
    generateOtp() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }
    issueToken(user) {
        const payload = { sub: user.id, phone: user.phone, role: user.role };
        return this.jwtService.sign(payload);
    }
    sanitizeUser(user) {
        const { otpCode, otpExpiresAt, ...safe } = user;
        return safe;
    }
    async sendSmsStub(phone, otp) {
        this.logger.warn(`[SMS STUB] Would send OTP ${otp} to ${phone}`);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map