import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, pass: string): Promise<any> {
    console.log(`[LocalStrategy] Validating ${email} with pass length ${pass?.length}`);
    const user = await this.authService.validateUser(email, pass);
    console.log(`[LocalStrategy] User found? ${!!user}`);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
