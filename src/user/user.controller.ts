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
import {
  ArrayOfUUID,
  CreateCompanyAdmin,
  CreateCompanyUsers,
  CreateUserDto,
} from './dto/create-user.dto';
import {
  updateCompanyAdmin,
  UpdateCompanyUser,
  UpdateUserDto,
} from './dto/update-user.dto';
import { Roles as UserRoles } from 'src/util/types/roles.enum';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/util/decorators/currentUser';
import { User } from './entities/user.entity';
import { CompanyQuery, ItemQuery } from 'src/util/common/query';
import { RolesGuard } from 'src/util/guards/roles.guard';
import { Roles } from 'src/util/decorators/roles.decorator';
import { CompanyID, UUIDParam } from 'src/util/common/param';

@ApiBearerAuth('Authorization')
@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiTags('Portal Admin')
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

  @ApiTags('Portal Admin')
  @ApiOperation({ summary: UserRoles.PORTAL_ADMIN + ' Find all users' })
  @Roles(UserRoles.PORTAL_ADMIN)
  @UseGuards(RolesGuard)
  @Get()
  findAll(@Query() query: ItemQuery) {
    return this.userService.findAll(query.page, query.limit);
  }

  @ApiTags('Portal Admin')
  @ApiOperation({
    summary: UserRoles.PORTAL_ADMIN + ' Find One ' + UserRoles.COMPANY_ADMIN,
  })
  @Roles(UserRoles.PORTAL_ADMIN)
  @UseGuards(RolesGuard)
  @Get('portal-admin/:id')
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

  @ApiTags('Portal Admin')
  @ApiOperation({
    summary: UserRoles.PORTAL_ADMIN + ' Find all ' + UserRoles.COMPANY_ADMIN,
  })
  @Roles(UserRoles.PORTAL_ADMIN)
  @UseGuards(RolesGuard)
  @Get('portal-admin')
  findAllCompanyAdmin(@Query() query: ItemQuery) {
    return this.userService.findAllCompanyAdmin(query.page, query.limit);
  }

  @ApiTags('Portal Admin')
  @ApiOperation({
    summary:
      UserRoles.PORTAL_ADMIN +
      ' Find by specific company ' +
      UserRoles.COMPANY_ADMIN,
  })
  @Roles(UserRoles.PORTAL_ADMIN)
  @UseGuards(RolesGuard)
  @Get('portal-admin/all/:companyId')
  findOneCompanyAdmin(@Query() query: ItemQuery, @Param() param: CompanyID) {
    return this.userService.findOneCompanyAdmin(
      query.page,
      query.limit,
      param.companyId,
    );
  }

  @ApiTags('Portal Admin')
  @ApiOperation({
    summary: UserRoles.PORTAL_ADMIN + ' Create ' + UserRoles.COMPANY_ADMIN,
  })
  @Roles(UserRoles.PORTAL_ADMIN)
  @UseGuards(RolesGuard)
  @Post('portal-admin')
  CreateCompanyAdmin(@Body() user: CreateCompanyAdmin) {
    return this.userService.CreateCompanyAdmin(user);
  }

  @ApiTags('Portal Admin')
  @ApiOperation({
    summary: UserRoles.PORTAL_ADMIN + ' Update ' + UserRoles.COMPANY_ADMIN,
  })
  @Roles(UserRoles.PORTAL_ADMIN)
  @UseGuards(RolesGuard)
  @Patch('portal-admin/:id')
  updateCompanyAdmin(
    @Body() user: updateCompanyAdmin,
    @Param() param: UUIDParam,
  ) {
    return this.userService.updateCompanyAdmin(user, param.id);
  }

  @ApiTags('Portal Admin')
  @ApiOperation({
    summary: UserRoles.PORTAL_ADMIN + ' Delete ' + UserRoles.COMPANY_ADMIN,
  })
  @Roles(UserRoles.PORTAL_ADMIN)
  @UseGuards(RolesGuard)
  @Delete('portal-admin/:id')
  deleteCompanyAdmin(@Param() param: UUIDParam) {
    return this.userService.deleteCompanyAdmin(param.id);
  }

  @ApiTags('Company Admin')
  @ApiOperation({
    summary: UserRoles.COMPANY_ADMIN + ' add users in the company',
  })
  @Roles(UserRoles.COMPANY_ADMIN)
  @UseGuards(RolesGuard)
  @Post('company-admin/users/crate-many')
  addUsersBulk(
    @CurrentUser() user: User,
    @Body() bulkUser: CreateCompanyUsers,
  ) {
    return this.userService.addUsersBulk(user.companyId, bulkUser.users);
  }

  @ApiTags('Company Admin')
  @ApiOperation({
    summary: UserRoles.COMPANY_ADMIN + ' remove users from the company',
  })
  @Roles(UserRoles.COMPANY_ADMIN)
  @UseGuards(RolesGuard)
  @Post('company-admin/users/remove-many')
  removeUserBulk(@CurrentUser() user: User, @Body() body: ArrayOfUUID) {
    return this.userService.RemoveUsersBulk(user.companyId, body.ids);
  }

  @ApiTags('Company Admin')
  @ApiOperation({
    summary: UserRoles.COMPANY_ADMIN + ' Get users from the company',
  })
  @Roles(UserRoles.COMPANY_ADMIN)
  @UseGuards(RolesGuard)
  @Get('company-admin/users/all')
  getCurrentCompanyUsers(
    @CurrentUser() user: User,
    @Query() query: CompanyQuery,
  ) {
    return this.userService.getCurrentCompanyUsers(
      query.page,
      query.limit,
      query.status,
      user.companyId,
    );
  }
  @ApiTags('Company Admin')
  @ApiOperation({
    summary: UserRoles.COMPANY_ADMIN + ' restore users of the company',
  })
  @Roles(UserRoles.COMPANY_ADMIN)
  @UseGuards(RolesGuard)
  @Post('company-admin/users/restore')
  restoreUsersBulk(@CurrentUser() user: User, @Body() body: ArrayOfUUID) {
    return this.userService.restoreUsersBulk(user.companyId, body.ids);
  }

  @ApiTags('Company Admin')
  @ApiOperation({
    summary: UserRoles.COMPANY_ADMIN + ' update users of the company',
  })
  @Roles(UserRoles.COMPANY_ADMIN)
  @UseGuards(RolesGuard)
  @Patch('company-admin/user/:id')
  updateUserOfCompany(
    @CurrentUser() user: User,
    @Body() body: UpdateCompanyUser,
    @Param() param: UUIDParam,
  ) {
    return this.userService.updateUserOfCompany(user.companyId, body, param.id);
  }
}
