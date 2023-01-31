import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/modules/user/entities/user.entity';
import { Roles } from 'src/util/types/roles.enum';
import { Status } from 'src/util/types/status.enum';
import { Not, Repository } from 'typeorm';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Company } from './entities/company.entity';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
  ) {}
  create(createCompanyDto: CreateCompanyDto) {
    const company = this.companyRepository.create(createCompanyDto);
    return this.companyRepository.save(company);
  }

  async findAll(page: number, limit: number) {
    const [data, total] = await this.companyRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, total };
  }

  async update(id: string, updateCompanyDto: UpdateCompanyDto, user: User) {
    const company = await this.companyRepository.update(id, updateCompanyDto);
    let query = {};
    if (user.role === Roles.COMPANY_ADMIN) {
      query = {
        id: user.companyId,
      };
    } else {
      query = {
        id,
      };
    }
    const updatedCompany = await this.findOne({
      id,
      ...query,
    });
    if (!updatedCompany) throw new HttpException('Company not found', 404);

    return updatedCompany;
  }

  async remove(id: string) {
    const company = await this.companyRepository.update(id, {
      status: Status.INACTIVE,
    });
    const updatedCompany = await this.findOne({
      id,
    });
    if (!updatedCompany) throw new HttpException('Company not found', 404);

    return updatedCompany;
  }

  async findOne(options: Partial<Company>) {
    return await this.companyRepository.findOne({
      where: { ...options, status: Not(Status.INACTIVE) },
    });
  }
  async showOwnCompany(companyId: string) {
    const company = await this.companyRepository.findOne({
      where: { id: companyId },
    });
    return company;
  }
}
