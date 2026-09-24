import { IsString, Matches, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendOtpDto {
  @ApiProperty({ example: '9876543210', description: '10-digit mobile number' })
  @IsString()
  @Matches(/^[6-9]\d{9}$/, { message: 'Invalid Indian mobile number' })
  phone: string;
}

export class VerifyOtpDto {
  @ApiProperty({ example: '9876543210' })
  @IsString()
  @Matches(/^[6-9]\d{9}$/, { message: 'Invalid Indian mobile number' })
  phone: string;

  @ApiProperty({ example: '123456', description: '6-digit OTP' })
  @IsString()
  @Length(6, 6, { message: 'OTP must be exactly 6 digits' })
  otp: string;

  @ApiProperty({ example: 'Ramesh Kumar', description: 'Full name (only for new users)' })
  @IsString()
  @Length(2, 120)
  name: string;
}

export class SelectRoleDto {
  @ApiProperty({ enum: ['citizen', 'student', 'faculty', 'industry_partner', 'admin'] })
  @IsString()
  role: string;

  @ApiProperty({ required: false, example: 'IIT ISM Dhanbad' })
  @IsString()
  orgAffiliation?: string;
}
