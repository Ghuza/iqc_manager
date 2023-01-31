import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsString,
  IsUUID,
} from 'class-validator';
import { ProjectStatus } from 'src/util/types/status.enum';

export class CreateProjectDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsString()
  logo: string;

  @ApiProperty({
    enum: [
      ProjectStatus.DONE,
      ProjectStatus.NOT_STARTED,
      ProjectStatus.IN_PROGRESS,
    ],
    default: ProjectStatus.NOT_STARTED,
  })
  @IsEnum([
    ProjectStatus.DONE,
    ProjectStatus.IN_PROGRESS,
    ProjectStatus.NOT_STARTED,
  ])
  status: string;
}

export class ArrayOfUUID {
  @ApiProperty()
  @IsArray()
  @IsUUID('4', { each: true })
  @ArrayMinSize(0)
  @ArrayMaxSize(100)
  ids: string[];
}
