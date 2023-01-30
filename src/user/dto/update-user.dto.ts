import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { Roles } from 'src/util/types/roles.enum';
import { Status } from 'src/util/types/status.enum';
import { CreateCompanyAdmin, CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {}
export class CompanyAdmin extends PickType(CreateCompanyAdmin, [
  'companyId',
  'email',
  'firstName',
  'lastName',
]) {
  @ApiProperty()
  @IsEnum([Status.ACTIVE, Status.INACTIVE])
  status: Status;

  @ApiProperty()
  @IsEnum([Roles.COMPANY_ADMIN, Roles.USER])
  role: string;
}

export class updateCompanyAdmin extends PartialType(CompanyAdmin) {}
