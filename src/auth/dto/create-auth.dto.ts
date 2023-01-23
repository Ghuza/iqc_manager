import { IsEmail, IsEnum, IsString } from '@nestjs/class-validator';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { MaxLength } from 'class-validator';

export class CreateAuthDto {
  @ApiProperty()
  @IsString()
  @MaxLength(64)
  firstName: string;

  @ApiProperty()
  @IsString()
  @MaxLength(64)
  lastName: string;

  @ApiProperty()
  @IsEmail()
  @MaxLength(320)
  email: string;

  @ApiProperty()
  @IsString()
  @MaxLength(64)
  password: string;
}

export class SignInDto extends PickType(CreateAuthDto, ['email', 'password']) {}
