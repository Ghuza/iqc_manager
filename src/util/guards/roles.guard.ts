import { CanActivate, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: any): boolean {
    console.log('start validation1');
    const Handler = this.reflector.get<string[]>('roles', context.getHandler());
    const Controller = this.reflector.get<string[]>(
      'roles',
      context.getClass(),
    );

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    console.log({ user });

    // check if the user has the required role
    if (Controller?.includes(user.role)) {
      return true;
    }
    if (Handler?.includes(user.role)) {
      return true;
    }

    return false;
  }
}
