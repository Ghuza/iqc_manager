import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/util/decorators/roles.decorator';
import { Roles as UserRoles } from 'src/util/types/roles.enum';
import { RolesGuard } from 'src/util/guards/roles.guard';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { ItemQuery } from 'src/util/common/query';
import { CompanyID, UUIDParam } from 'src/util/common/param';
import { CurrentUser } from 'src/util/decorators/currentUser';
import { User } from 'src/modules/user/entities/user.entity';

@ApiBearerAuth('Authorization')
@ApiTags('Company')
@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Roles(UserRoles.PORTAL_ADMIN)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: UserRoles.PORTAL_ADMIN + ' Create company' })
  @Post()
  create(@Body() createCompanyDto: CreateCompanyDto) {
    return this.companyService.create(createCompanyDto);
  }

  @ApiOperation({ summary: UserRoles.PORTAL_ADMIN + ' Find all the company' })
  @Roles(UserRoles.PORTAL_ADMIN)
  @UseGuards(RolesGuard)
  @Get('all')
  findAll(@Query() query: ItemQuery) {
    return this.companyService.findAll(query.page, query.limit);
  }

  @ApiOperation({ summary: UserRoles.PORTAL_ADMIN + ' Find one company' })
  @Roles(UserRoles.PORTAL_ADMIN)
  @UseGuards(RolesGuard)
  @Get(':companyId')
  findOne(@Param() param: CompanyID) {
    return this.companyService.findOne({
      id: param.companyId,
    });
  }

  @ApiTags('Company Admin')
  @ApiTags('Portal Admin')
  @Roles(UserRoles.PORTAL_ADMIN, UserRoles.COMPANY_ADMIN)
  @UseGuards(RolesGuard)
  @ApiOperation({
    summary:
      [UserRoles.PORTAL_ADMIN, UserRoles.COMPANY_ADMIN] + ' Update company',
  })
  @Patch(':companyId')
  update(
    @Param() param: CompanyID,
    @Body() updateCompanyDto: UpdateCompanyDto,
    @CurrentUser() user: User,
  ) {
    return this.companyService.update(param.companyId, updateCompanyDto, user);
  }

  @Roles(UserRoles.PORTAL_ADMIN)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: UserRoles.PORTAL_ADMIN + ' delete company' })
  @Delete(':companyId')
  remove(@Param() param: CompanyID) {
    return this.companyService.remove(param.companyId);
  }

  @ApiTags('Company Admin')
  @ApiOperation({
    summary: UserRoles.COMPANY_ADMIN + ' show Own Company',
  })
  @Roles(UserRoles.COMPANY_ADMIN)
  @UseGuards(RolesGuard)
  @Get('show/company')
  showOwnCompany(@CurrentUser() user: User) {
    return this.companyService.showOwnCompany(user.companyId);
  }
}
