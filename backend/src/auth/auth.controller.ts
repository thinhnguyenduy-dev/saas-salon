import {
  Controller,
  Request,
  Post,
  UseGuards,
  Body,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  @ApiOperation({ summary: 'Login with email and password' })
  @ApiBody({ type: LoginDto })
  async login(@Request() req: any, @Body() loginDto: LoginDto) {
    return this.authService.login(req.user);
  }

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Get('profile')
  @ApiOperation({ summary: 'Get current user profile' })
  getProfile(@Request() req: any) {
    return req.user;
  }
}
