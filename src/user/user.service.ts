import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { UpdateCompanyDto } from 'src/company/dto/update-company.dto';
import { Roles } from 'src/util/types/roles.enum';
import { Status } from 'src/util/types/status.enum';
import { FindOneOptions, Not, Repository } from 'typeorm';
import { CreateCompanyAdmin, CreateUserDto } from './dto/create-user.dto';
import { updateCompanyAdmin, UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async createUser(user: CreateUserDto) {
    const newUser = this.userRepository.create(user);
    const createdUser = await this.userRepository.save(newUser);
    return { ...createdUser, password: undefined };
  }

  async findAll(page: number, limit: number) {
    const [data, total] = await this.userRepository.findAndCount({
      where: {
        status: Not(Status.INACTIVE),
      },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, total };
  }

  findOne(options: Partial<User>, fields: (keyof User)[] = ['id']) {
    return this.userRepository.findOne({
      where: { ...options, status: Not(Status.INACTIVE) },
      select: fields,
    });
  }

  async CreateCompanyAdmin(companyAdmin: CreateCompanyAdmin) {
    const userExists = await this.findOne({
      email: companyAdmin.email,
    });

    if (userExists) {
      throw new HttpException('This Email Already Used', 400);
    }
    const hashedPassword = await bcrypt.hash(companyAdmin.password, 12);
    const user = await this.userRepository.save({
      ...companyAdmin,
      role: Roles.COMPANY_ADMIN,
      password: hashedPassword,
    });
    return {
      ...user,
      password: undefined,
    };
  }

  async findAllCompanyAdmin(page: number, limit: number) {
    const [data, total] = await this.userRepository.findAndCount({
      where: { role: Roles.COMPANY_ADMIN, status: Not(Status.INACTIVE) },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, total };
  }

  async findOneCompanyAdmin(page: number, limit: number, companyId: string) {
    const [data, total] = await this.userRepository.findAndCount({
      where: {
        role: Roles.COMPANY_ADMIN,
        companyId,
        status: Not(Status.INACTIVE),
      },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, total };
  }

  async updateCompanyAdmin(user: updateCompanyAdmin, id: string) {
    const updatedUser = await this.userRepository.update(id, user);
    const updatedUserDetails = await this.findOne({ id }, [
      'id',
      'firstName',
      'lastName',
      'email',
      'role',
      'status',
      'companyId',
    ]);
    return updatedUserDetails;
  }
  async deleteCompanyAdmin(id: string) {
    const updatedUser = await this.userRepository.update(id, {
      status: Status.INACTIVE,
    });
    const updatedUserDetails = await this.findOne({ id }, [
      'id',
      'firstName',
      'lastName',
      'email',
      'role',
      'status',
      'companyId',
    ]);
    return updatedUserDetails;
  }
}
