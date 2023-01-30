import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { UpdateCompanyDto } from 'src/company/dto/update-company.dto';
import { Roles } from 'src/util/types/roles.enum';
import { Status } from 'src/util/types/status.enum';
import { FindOneOptions, In, Not, Repository } from 'typeorm';
import {
  CreateCompanyAdmin,
  CreateCompanyUsers,
  CreateUserDto,
} from './dto/create-user.dto';
import {
  updateCompanyAdmin,
  UpdateCompanyUser,
  UpdateUserDto,
} from './dto/update-user.dto';
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
  async addUsersBulk(companyId: string, users: Partial<CreateUserDto[]>) {
    const emails = users.map((user) => user.email);
    const usersExists = await this.userRepository.findOne({
      where: { email: In(emails) },
    });
    if (usersExists) {
      throw new HttpException(`${usersExists.email} Already Used`, 400);
    }
    const bulkUsers = users.map(async (user) => {
      const hashedPassword = await bcrypt.hash(user.password, 12);
      return {
        ...user,
        companyId,
        password: hashedPassword,
        role: Roles.USER,
      };
    });
    const allUsers = await Promise.all(bulkUsers);

    const usersToSave = this.userRepository.create(allUsers);

    return await this.userRepository.save(usersToSave);
  }

  async RemoveUsersBulk(companyId: string, ids: string[]) {
    const users = await this.userRepository.findOne({
      where: { id: In(ids), companyId: Not(companyId) },
    });
    if (users) {
      throw new HttpException(
        `User with email: ${users.email} Not Found in this company`,
        400,
      );
    }

    const updatedUsers = await this.userRepository.update(ids, {
      status: Status.INACTIVE,
    });
    return { status: 'success', message: 'Users removed Successfully' };
  }
  async getCurrentCompanyUsers(
    page: number,
    limit: number,
    status: string,
    companyId: string,
  ) {
    const [data, total] = await this.userRepository.findAndCount({
      where: {
        companyId,
        status,
        role: Roles.USER,
      },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, total };
  }
  async restoreUsersBulk(companyId: string, ids: string[]) {
    const usersUpdate = await this.userRepository.update(
      { id: In(ids), status: Status.INACTIVE },
      {
        status: Status.ACTIVE,
      },
    );
    return { status: 'success', message: 'Users restored Successfully' };
  }

  async updateUserOfCompany(
    companyId: string,
    user: UpdateCompanyUser,
    userId: string,
  ) {
    const userExists = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!userExists) {
      throw new HttpException('User Not Found', 400);
    }
    if (user.email && userExists.email !== user.email) {
      const emailExists = await this.userRepository.findOne({
        where: { email: user.email },
      });
      if (emailExists) {
        throw new HttpException('This Email Already Used', 400);
      }
    }

    const updatedUser = await this.userRepository.update(
      { id: userId, companyId },
      user,
    );
    const updatedUserDetails = await this.findOne({ id: userId }, [
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
