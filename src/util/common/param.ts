import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class UUIDParam {
  @ApiProperty()
  @IsUUID()
  public id: string;
}
export class CompanyID {
  @ApiProperty()
  @IsUUID()
  public companyId: string;
}
