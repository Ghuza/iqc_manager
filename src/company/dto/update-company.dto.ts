import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { Status } from 'src/util/types/status.enum';
import { CreateCompanyDto } from './create-company.dto';

export class UpdateCompanyDto extends PartialType(CreateCompanyDto) {
  @ApiProperty()
  @IsEnum([Status.ACTIVE, Status.INACTIVE])
  status: Status;
}
