import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { toNumber } from 'lodash';
import { ProjectStatus, Status } from '../types/status.enum';

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

export class OwnProject {
  @ApiProperty()
  @IsOptional()
  @MinLength(0)
  @MaxLength(100)
  projectName: string;
}

export class QueryOwnProjects extends PartialType(OwnProject) {
  @ApiProperty()
  @IsOptional()
  @IsEnum([
    ProjectStatus.DONE,
    ProjectStatus.NOT_STARTED,
    ProjectStatus.IN_PROGRESS,
  ])
  status: ProjectStatus;

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
