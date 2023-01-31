import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Status } from '../types/status.enum';

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }
  handleRequest(err, user, info, context: ExecutionContext) {
    if (user.status === Status.INACTIVE)
      throw new UnauthorizedException('User is inactive');

    const Handler = this.reflector.get<string[]>(
      'allowAccess',
      context.getHandler(),
    );
    const Controller = this.reflector.get<string[]>(
      'allowAccess',
      context.getClass(),
    );
    if (user) return user;
    if (Controller || Handler) return true;
    throw new UnauthorizedException();
  }
}
