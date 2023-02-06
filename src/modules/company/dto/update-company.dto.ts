import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { Status } from 'src/util/types/status.enum';
import { CreateCompanyDto } from './create-company.dto';

export class UpdateCompany extends CreateCompanyDto {
  @ApiProperty({
    default: Status.ACTIVE,
  })
  @IsEnum([Status.ACTIVE, Status.INACTIVE])
  status: Status;
}
export class UpdateCompanyDto extends PartialType(UpdateCompany) {}
