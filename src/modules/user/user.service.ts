import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Roles } from 'src/util/types/roles.enum';
import { Status } from 'src/util/types/status.enum';
import { In, Not, Repository } from 'typeorm';
import { CreateCompanyAdmin, CreateUserDto } from './dto/create-user.dto';
import { updateCompanyAdmin, UpdateCompanyUser } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { UsersRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepo: UsersRepository) {}

  async findAll(page: number, limit: number) {
    const [data, total] = await this.userRepo.findAll({
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, total };
  }

  findOne(options: Partial<User>, fields: (keyof User)[] = ['id']) {
    return this.userRepo.findByCondition({
      where: { ...options },
      select: fields,
    });
  }

  async CreateCompanyAdmin(companyAdmin: CreateCompanyAdmin) {
    const userExists = await this.userRepo.findByCondition({
      where: { email: companyAdmin.email },
    });

    if (userExists) {
      throw new HttpException('This Email Already Used', HttpStatus.CONFLICT);
    }
    const hashedPassword = await bcrypt.hash(companyAdmin.password, 12);
    const user = await this.userRepo.save([
      {
        ...companyAdmin,
        role: Roles.COMPANY_ADMIN,
        password: hashedPassword,
      },
    ]);
    return {
      ...user,
      password: undefined,
    };
  }

  async findAllCompanyAdmin(page: number, limit: number) {
    const [data, total] = await this.userRepo.findAll({
      where: { role: Roles.COMPANY_ADMIN, status: Not(Status.INACTIVE) },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, total };
  }

  async findOneCompanyAdmin(page: number, limit: number, companyId: string) {
    const [data, total] = await this.userRepo.findAll({
      where: {
        role: Roles.COMPANY_ADMIN,
        companyId,
      },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, total };
  }

  async updateCompanyAdmin(user: updateCompanyAdmin, id: string) {
    const updatedUser = await this.userRepo.update(id, user);
    const updatedUserDetails = await this.userRepo.findByCondition({
      where: { id },
      select: [
        'id',
        'firstName',
        'lastName',
        'email',
        'role',
        'status',
        'companyId',
      ],
    });

    return updatedUserDetails;
  }
  async deleteCompanyAdmin(id: string) {
    const user = await this.userRepo.findByCondition({
      where: { id },
    });

    if (user.status === Status.INACTIVE) {
      throw new HttpException('User Already Deleted', HttpStatus.BAD_GATEWAY);
    }

    const updatedUser = await this.userRepo.update(id, {
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
    const usersExists = await this.userRepo.findByCondition({
      where: { email: In(emails) },
    });
    if (usersExists) {
      throw new HttpException(
        `${usersExists.email} Already Used`,
        HttpStatus.BAD_REQUEST,
      );
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

    const usersToSave = this.userRepo.create(allUsers);

    return await this.userRepo.save(usersToSave);
  }

  async RemoveUsersBulk(companyId: string, ids: string[]) {
    const users = await this.userRepo.findByCondition({
      where: { id: In(ids), companyId: Not(companyId) },
    });
    if (users) {
      throw new HttpException(
        `User with email: ${users.email} Not Found in this company`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const updatedUsers = await this.userRepo.update(ids, {
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
    const [data, total] = await this.userRepo.findAll({
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
    const users = await this.userRepo.findByCondition({
      where: { id: In(ids), companyId: Not(companyId) },
    });
    if (users) {
      throw new HttpException(
        `User with email: ${users.email} Not Found in this company`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const usersUpdate = await this.userRepo.update(
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
    const userExists = await this.userRepo.findByCondition({
      where: { id: userId, companyId },
    });

    if (!userExists) {
      throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);
    }
    if (user.email && userExists.email !== user.email) {
      const emailExists = await this.userRepo.findByCondition({
        where: { email: user.email },
      });
      if (emailExists) {
        throw new HttpException(
          'This Email Already Used',
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    const updatedUser = await this.userRepo.update(
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

  async areInTheSameCompany(userIds: string[], companyId: string) {
    const user = await this.userRepo.findByCondition({
      where: { id: In(userIds), companyId: Not(companyId) },
    });

    if (user) {
      return false;
    }
    return true;
  }
}
