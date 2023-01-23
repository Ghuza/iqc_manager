import { HttpException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { CreateAuthDto, SignInDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}
  async create(newUser: CreateAuthDto) {
    const userExists = await this.userService.findOne({
      email: newUser.email,
    });

    if (userExists) {
      throw new HttpException('This Email Already Used', 400);
    }
    const hashedPassword = await bcrypt.hash(newUser.password, 12);
    const user = await this.userService.createUser({
      ...newUser,
      password: hashedPassword,
    });
    return {
      ...user,
      token: this.jwtService.sign({ id: user.id, email: user.email }),
    };
  }

  async signIn(signUpUser: SignInDto) {
    const user = await this.userService.findOne(
      {
        email: signUpUser.email,
      },
      ['id', 'email', 'password', 'firstName', 'lastName', 'role'],
    );

    const isPasswordValid = await bcrypt.compare(
      signUpUser.password,
      user.password,
    );

    if (!user || !isPasswordValid) {
      throw new HttpException('User email or password is not correct ', 404);
    }

    return {
      ...user,
      password: undefined,
      token: this.jwtService.sign({ id: user.id, email: user.email }),
    };
  }

  async findOne(options: Partial<User>, fields: (keyof User)[]) {
    console.log('start validation');
    const user = await this.userService.findOne(options, fields);
    return user;
  }

  async sign(user: User) {
    return {
      access_token: this.jwtService.sign({ user }),
    };
  }
}
