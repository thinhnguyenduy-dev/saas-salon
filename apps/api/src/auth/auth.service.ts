import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserRole } from '../schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);
    if (user && (await user.comparePassword(pass))) {
      const { password, ...result } = user.toObject();
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user._id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: this.jwtService.sign(payload, { expiresIn: '7d' }),
    };
  }

  async register(userDto: any) {
    // Check if email exists
    const existing = await this.usersService.findOneByEmail(userDto.email);
    if (existing) {
      throw new UnauthorizedException('Email already exists');
    }
    const newUser = await this.usersService.create(userDto);
    return this.login(newUser);
  }

  async refreshToken(user: any) {
    const payload = { email: user.email, sub: user.userId || user.sub, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: this.jwtService.sign(payload, { expiresIn: '7d' }),
    };
  }

  async logout(userId: string) {
    // Implement Redis blacklist logic here
    return { success: true };
  }
}
