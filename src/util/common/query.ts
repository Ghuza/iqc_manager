import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsNumber, Max, Min } from 'class-validator';
import { toNumber } from 'lodash';
import { Status } from '../types/status.enum';

export class ItemQuery {
  @ApiProperty({ default: 1 })
  @IsNumber()
  @Min(1)
  @Transform(({ value }) => toNumber(value))
  public page: number;

  @ApiProperty({ default: 20 })
  @IsNumber()
  @Transform(({ value }) => toNumber(value))
  @Max(20)
  public limit: number;
}

export class CompanyQuery extends ItemQuery {
  @ApiProperty({ default: Status.ACTIVE })
  @IsEnum([Status.ACTIVE, Status.INACTIVE])
  status: Status;
}
