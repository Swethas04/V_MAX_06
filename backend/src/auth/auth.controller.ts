import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Request,
  Patch,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiOkResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SendOtpDto, VerifyOtpDto, SelectRoleDto } from './dto/auth.dto';
import { JwtAuthGuard } from './guards';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('send-otp')
  @ApiOperation({ summary: 'Send OTP to phone number' })
  sendOtp(@Body() dto: SendOtpDto) {
    return this.authService.sendOtp(dto);
  }

  @Post('verify-otp')
  @ApiOperation({ summary: 'Verify OTP and receive JWT access token' })
  @ApiOkResponse({ description: 'Returns accessToken + user object + isNewUser flag' })
  verifyOtp(@Body() dto: VerifyOtpDto) {
    return this.authService.verifyOtp(dto);
  }

  @Patch('select-role')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Set/update user role (call after first login)' })
  selectRole(@Request() req: any, @Body() dto: SelectRoleDto) {
    return this.authService.selectRole(req.user.id, dto);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get authenticated user profile' })
  getProfile(@Request() req: any) {
    return this.authService.getProfile(req.user.id);
  }

  @Patch('fcm-token')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update Firebase Cloud Messaging device token' })
  updateFcmToken(@Request() req: any, @Body() body: { fcmToken: string }) {
    return this.authService.updateFcmToken(req.user.id, body.fcmToken);
  }
}
