import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Status } from 'src/util/types/status.enum';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsString()
  lastName: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  password: string;
}

export class CreateCompanyAdmin extends CreateUserDto {
  @ApiProperty()
  @IsUUID()
  companyId: string;
}

export class CreateCompanyUsers {
  @ApiProperty({
    type: [CreateUserDto],
  })
  @IsNotEmpty()
  @IsArray()
  @ArrayMaxSize(20)
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateUserDto)
  users: CreateUserDto[];
}

export class ArrayOfUUID {
  @ApiProperty()
  @IsArray()
  @IsUUID('4', { each: true })
  @ArrayMinSize(0)
  @ArrayMaxSize(100)
  ids: string[];
}
