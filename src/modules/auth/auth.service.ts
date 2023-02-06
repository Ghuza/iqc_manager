import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/modules/user/entities/user.entity';
import { UserService } from 'src/modules/user/user.service';
import { SignInDto } from './dto/create-auth.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(signUpUser: SignInDto) {
    const user = await this.userService.findOne(
      {
        email: signUpUser.email.toLowerCase(),
      },
      ['id', 'email', 'password', 'firstName', 'lastName', 'role'],
    );

    const isPasswordValid = await bcrypt.compare(
      signUpUser.password,
      user.password,
    );

    if (!user || !isPasswordValid) {
      throw new HttpException(
        'User email or password is not correct ',
        HttpStatus.NOT_FOUND,
      );
    }

    return {
      ...user,
      password: undefined,
      token: this.jwtService.sign({ id: user.id, email: user.email }),
    };
  }

  async findOne(options: Partial<User>, fields: (keyof User)[]) {
    const user = await this.userService.findOne(options, fields);
    return user;
  }

  async sign(user: User) {
    return {
      access_token: this.jwtService.sign({ user }),
    };
  }
}
