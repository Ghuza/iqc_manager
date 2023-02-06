import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, MaxLength } from 'class-validator';
import { Status } from 'src/util/types/status.enum';

export class CreateCompanyDto {
  @ApiProperty()
  @IsString()
  @MaxLength(256)
  name: string;

  @ApiProperty()
  @IsString()
  @MaxLength(4000)
  description: string;

  @ApiProperty()
  @IsString()
  @MaxLength(512)
  logo: string;
}
