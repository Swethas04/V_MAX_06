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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SelectRoleDto = exports.VerifyOtpDto = exports.SendOtpDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class SendOtpDto {
}
exports.SendOtpDto = SendOtpDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '9876543210', description: '10-digit mobile number' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^[6-9]\d{9}$/, { message: 'Invalid Indian mobile number' }),
    __metadata("design:type", String)
], SendOtpDto.prototype, "phone", void 0);
class VerifyOtpDto {
}
exports.VerifyOtpDto = VerifyOtpDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '9876543210' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^[6-9]\d{9}$/, { message: 'Invalid Indian mobile number' }),
    __metadata("design:type", String)
], VerifyOtpDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '123456', description: '6-digit OTP' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(6, 6, { message: 'OTP must be exactly 6 digits' }),
    __metadata("design:type", String)
], VerifyOtpDto.prototype, "otp", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Ramesh Kumar', description: 'Full name (only for new users)', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(2, 120),
    __metadata("design:type", String)
], VerifyOtpDto.prototype, "name", void 0);
class SelectRoleDto {
}
exports.SelectRoleDto = SelectRoleDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ['citizen', 'student', 'faculty', 'industry_partner', 'admin'] }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SelectRoleDto.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, example: 'IIT ISM Dhanbad' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SelectRoleDto.prototype, "orgAffiliation", void 0);
//# sourceMappingURL=auth.dto.js.map