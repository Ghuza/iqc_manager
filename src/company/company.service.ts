import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

  async update(id: string, updateCompanyDto: UpdateCompanyDto) {
    const company = await this.companyRepository.update(id, updateCompanyDto);
    const updatedCompany = await this.findOne({
      id,
    });
    if (!updatedCompany) throw new HttpException('Company not found', 404);

    return updatedCompany;
  }

  async remove(id: string) {
    const company = await this.findOne({
      id,
    });
    if (!company) throw new HttpException('Company not found', 404);
    await this.companyRepository.delete(id);
    return company;
  }

  async findOne(options: Partial<Company>) {
    return await this.companyRepository.findOne({
      where: options,
    });
  }
}
