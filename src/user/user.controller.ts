import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateCompanyAdmin, CreateUserDto } from './dto/create-user.dto';
import { updateCompanyAdmin, UpdateUserDto } from './dto/update-user.dto';
import { Roles as UserRoles } from 'src/util/types/roles.enum';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/util/decorators/currentUser';
import { User } from './entities/user.entity';
import { ItemQuery } from 'src/util/common/query';
import { RolesGuard } from 'src/util/guards/roles.guard';
import { Roles } from 'src/util/decorators/roles.decorator';
import { CompanyID, UUIDParam } from 'src/util/common/param';

@ApiBearerAuth('Authorization')
@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Show yourself' })
  @Get('self]')
  findOneSelf(@CurrentUser() user: User) {
    return this.userService.findOne({ id: user.id }, [
      'id',
      'firstName',
      'lastName',
      'email',
      'role',
      'status',
    ]);
  }

  @ApiOperation({ summary: UserRoles.PORTAL_ADMIN + ' Find all users' })
  @Roles(UserRoles.PORTAL_ADMIN)
  @UseGuards(RolesGuard)
  @Get()
  findAll(@Query() query: ItemQuery) {
    return this.userService.findAll(query.page, query.limit);
  }

  @ApiOperation({
    summary: UserRoles.PORTAL_ADMIN + ' Find One ' + UserRoles.COMPANY_ADMIN,
  })
  @Roles(UserRoles.PORTAL_ADMIN)
  @UseGuards(RolesGuard)
  @Get('portal_admin/:id')
  findOne(@Param() param: UUIDParam) {
    return this.userService.findOne({ id: param.id }, [
      'id',
      'firstName',
      'lastName',
      'email',
      'role',
      'status',
      'companyId',
    ]);
  }

  @ApiOperation({
    summary: UserRoles.PORTAL_ADMIN + ' Find all ' + UserRoles.COMPANY_ADMIN,
  })
  @Roles(UserRoles.PORTAL_ADMIN)
  @UseGuards(RolesGuard)
  @Get('portal_admin')
  findAllCompanyAdmin(@Query() query: ItemQuery) {
    return this.userService.findAllCompanyAdmin(query.page, query.limit);
  }

  @ApiOperation({
    summary:
      UserRoles.PORTAL_ADMIN +
      ' Find by specific company ' +
      UserRoles.COMPANY_ADMIN,
  })
  @Roles(UserRoles.PORTAL_ADMIN)
  @UseGuards(RolesGuard)
  @Get('portal_admin/all/:companyId')
  findOneCompanyAdmin(@Query() query: ItemQuery, @Param() param: CompanyID) {
    return this.userService.findOneCompanyAdmin(
      query.page,
      query.limit,
      param.companyId,
    );
  }

  @ApiOperation({
    summary: UserRoles.PORTAL_ADMIN + ' Create ' + UserRoles.COMPANY_ADMIN,
  })
  @Roles(UserRoles.PORTAL_ADMIN)
  @UseGuards(RolesGuard)
  @Post('portal_admin')
  CreateCompanyAdmin(@Body() user: CreateCompanyAdmin) {
    return this.userService.CreateCompanyAdmin(user);
  }

  @ApiOperation({
    summary: UserRoles.PORTAL_ADMIN + ' Update ' + UserRoles.COMPANY_ADMIN,
  })
  @Roles(UserRoles.PORTAL_ADMIN)
  @UseGuards(RolesGuard)
  @Patch('portal_admin/:id')
  updateCompanyAdmin(
    @Body() user: updateCompanyAdmin,
    @Param() param: UUIDParam,
  ) {
    return this.userService.updateCompanyAdmin(user, param.id);
  }

  @ApiOperation({
    summary: UserRoles.PORTAL_ADMIN + ' Delete ' + UserRoles.COMPANY_ADMIN,
  })
  @Roles(UserRoles.PORTAL_ADMIN)
  @UseGuards(RolesGuard)
  @Delete('portal_admin/:id')
  deleteCompanyAdmin(@Param() param: UUIDParam) {
    return this.userService.deleteCompanyAdmin(param.id);
  }
}
