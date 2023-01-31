import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from 'src/modules/auth/auth.service';
import { User } from 'src/modules/user/entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'secretKey',
    });
  }

  async validate(payload: Partial<User>) {
    const user = await this.authService.findOne({ id: payload.id }, [
      'id',
      'firstName',
      'lastName',
      'status',
      'email',
      'role',
      'companyId',
    ]);
    if (user) {
      return user;
    }
    return null;
  }
}
