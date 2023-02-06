import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from 'src/modules/user/entities/user.entity';
import { Roles } from 'src/util/types/roles.enum';
import { Status } from 'src/util/types/status.enum';
import { Not } from 'typeorm';
import { CompanyRepository } from './company.repository';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Company } from './entities/company.entity';

@Injectable()
export class CompanyService {
  constructor(private readonly companyRepo: CompanyRepository) {}
  create(createCompanyDto: CreateCompanyDto) {
    const company = this.companyRepo.create([createCompanyDto]);
    return this.companyRepo.save(company);
  }

  async findAll(page: number, limit: number) {
    const [data, total] = await this.companyRepo.findAll({
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, total };
  }

  async update(id: string, updateCompanyDto: UpdateCompanyDto, user: User) {
    if (
      id !== user.companyId &&
      ![Roles.COMPANY_ADMIN, Roles.PORTAL_ADMIN].includes(user.role as Roles)
    )
      throw new HttpException(
        'You are not allowed to update this company',
        HttpStatus.FORBIDDEN,
      );
    const company = await this.companyRepo.update(id, updateCompanyDto);

    const updatedCompany = await this.companyRepo.findByCondition({
      where: {
        id,
      },
    });
    if (!updatedCompany)
      throw new HttpException('Company not found', HttpStatus.NOT_FOUND);

    return updatedCompany;
  }

  async remove(id: string) {
    const isInactive = await this.companyRepo.findByCondition({
      where: {
        id,
        status: Status.INACTIVE,
      },
    });
    if (isInactive)
      throw new HttpException('Company was not found!', HttpStatus.NOT_FOUND);

    const company = await this.companyRepo.update(id, {
      status: Status.INACTIVE,
    });
    const updatedCompany = await this.companyRepo.findByCondition({
      where: {
        id,
      },
    });
    if (!updatedCompany) throw new HttpException('Company not found', 404);

    return updatedCompany;
  }

  async findOne(options: Partial<Company>) {
    return await this.companyRepo.findByCondition({
      where: { ...options, status: Not(Status.INACTIVE) },
    });
  }
  async showOwnCompany(companyId: string) {
    const company = await this.companyRepo.findByCondition({
      where: { id: companyId },
    });
    return company;
  }
}
