import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserRole } from '../entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);
    
    if (!user) {
      return null;
    }

    // console.log('[AuthService] User found. ID:', user.id);
    // console.log('[AuthService] Has password field?', !!user.password);
    
    const isMatch = await user.comparePassword(pass);
    // console.log(`[AuthService] Password match result: ${isMatch}`);

    if (user && isMatch) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role, shopId: user.shopId };
    return {
      ...payload, // Return basic user info (email, id, role)
      ...user, // Return other user fields if needed (e.g. fullName) - excluding password which is already handled
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
    const payload = { email: user.email, sub: user.userId || user.sub, role: user.role, shopId: user.shopId };
    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: this.jwtService.sign(payload, { expiresIn: '7d' }),
    };
  }

  async logout(userId: string) {
    // Implement Redis blacklist logic here
    return { success: true };
  }

  async validateOAuthUser(profile: any, provider: 'google' | 'microsoft') {
    const { email, firstName, lastName, googleId, microsoftId, picture } = profile;
    
    // Find user by email
    let user = await this.usersService.findOneByEmail(email);

    if (user) {
      if (provider === 'google' && !user.googleId) {
        // user.googleId = googleId; 
        // Sync if needed
      }
      return user;
    }

    // Create new user
    const newUser = await this.usersService.create({
      email,
      password: '', // Password is now nullable in DB but likely required in DTO/Service type. Handled by generic 'any' or service logic
      fullName: `${firstName} ${lastName}`,
      role: UserRole.CUSTOMER, // Default to CUSTOMER for public OAuth registration
      googleId: provider === 'google' ? googleId : undefined,
      microsoftId: provider === 'microsoft' ? microsoftId : undefined,
    });

    return newUser;
  }
}
