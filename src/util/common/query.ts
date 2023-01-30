import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, Max, Min } from 'class-validator';
import { toNumber } from 'lodash';

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
