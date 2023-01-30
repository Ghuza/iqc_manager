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
import { ProjectService } from './project.service';
import { ArrayOfUUID, CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'src/util/guards/roles.guard';
import { Roles } from 'src/util/decorators/roles.decorator';
import { Roles as UserRoles } from 'src/util/types/roles.enum';
import { CurrentUser } from 'src/util/decorators/currentUser';
import { User } from 'src/user/entities/user.entity';
import { ItemQuery } from 'src/util/common/query';
import { ProjectId, UUIDParam } from 'src/util/common/param';

@ApiBearerAuth('Authorization')
@ApiTags('project')
@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @ApiOperation({ summary: UserRoles.PORTAL_ADMIN + ' Create project' })
  @Roles(UserRoles.COMPANY_ADMIN)
  @UseGuards(RolesGuard)
  @Post()
  create(
    @Body() createProjectDto: CreateProjectDto,
    @CurrentUser() user: User,
  ) {
    return this.projectService.create(createProjectDto, user.companyId);
  }
  @ApiOperation({
    summary: UserRoles.USER + ' Get  the projects which I am a member of',
  })
  @Roles(UserRoles.USER)
  @UseGuards(RolesGuard)
  @Get('my-projects')
  getMyProject(@Query() query: ItemQuery, @CurrentUser() user: User) {
    return this.projectService.getMyProject(
      query.page,
      query.limit,
      user.id,
      user.companyId,
    );
  }

  @ApiOperation({ summary: UserRoles.PORTAL_ADMIN + ' Find all the projects' })
  @Roles(UserRoles.COMPANY_ADMIN)
  @UseGuards(RolesGuard)
  @Get()
  findAll(@Query() query: ItemQuery, @CurrentUser() user: User) {
    return this.projectService.findAll(query.page, query.limit, user.companyId);
  }
  @ApiOperation({ summary: UserRoles.PORTAL_ADMIN + ' Find one the projects' })
  @Roles(UserRoles.COMPANY_ADMIN)
  @UseGuards(RolesGuard)
  @Get(':id')
  findOne(@Param() param: UUIDParam, @CurrentUser() user: User) {
    return this.projectService.findOne(param.id, user.companyId);
  }

  @ApiOperation({
    summary: UserRoles.PORTAL_ADMIN + ' Update one the projects',
  })
  @Roles(UserRoles.COMPANY_ADMIN)
  @UseGuards(RolesGuard)
  @Patch(':id')
  update(
    @Param() param: UUIDParam,
    @Body() updateProjectDto: UpdateProjectDto,
    @CurrentUser() user: User,
  ) {
    return this.projectService.update(
      param.id,
      updateProjectDto,
      user.companyId,
    );
  }

  @ApiOperation({
    summary: UserRoles.PORTAL_ADMIN + ' assign users to the projects',
  })
  @Roles(UserRoles.COMPANY_ADMIN)
  @UseGuards(RolesGuard)
  @Post('assign-users/:projectId')
  assignUsersToProject(
    @Param() param: ProjectId,
    @Body() body: ArrayOfUUID,
    @CurrentUser() user: User,
  ) {
    return this.projectService.assignUsersToProject(
      param.projectId,
      body.ids,
      user.companyId,
    );
  }

  @ApiOperation({
    summary: UserRoles.PORTAL_ADMIN + ' remove users to the projects',
  })
  @Roles(UserRoles.COMPANY_ADMIN)
  @UseGuards(RolesGuard)
  @Post('remove-users/:projectId')
  removeUserFromProjectBulk(
    @Param() param: ProjectId,
    @Body() body: ArrayOfUUID,
    @CurrentUser() user: User,
  ) {
    return this.projectService.removeUserFromProjectBulk(
      body.ids,
      param.projectId,
    );
  }

  @ApiOperation({
    summary: UserRoles.PORTAL_ADMIN + ' show users from the project',
  })
  @Roles(UserRoles.COMPANY_ADMIN)
  @UseGuards(RolesGuard)
  @Post('show-users/:projectId')
  getUsersAssignedToProject(
    @Param() param: ProjectId,
    @Query() query: ItemQuery,
    @CurrentUser() user: User,
  ) {
    return this.projectService.getUsersAssignedToProject(
      query.page,
      query.limit,
      param.projectId,
      user.companyId,
    );
  }
}

// getUsersAssignedToProject
