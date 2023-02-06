import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from 'src/modules/user/user.service';
import { In, Not } from 'typeorm';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectToUserRepository } from './project-to-user.repository';
import { ProjectRepository } from './project.repository';

@Injectable()
export class ProjectService {
  constructor(
    private readonly projectToUserRepo: ProjectToUserRepository,
    private readonly userService: UserService,
    private readonly projectRepo: ProjectRepository,
  ) {}
  async create(createProjectDto: CreateProjectDto, companyId: string) {
    const project = this.projectRepo.create([
      {
        ...createProjectDto,
        companyId,
      },
    ]);
    const savedProject = await this.projectRepo.save(project);
    return savedProject;
  }

  async findAll(page: number, limit: number, companyId: string) {
    const [data, total] = await this.projectRepo.findAll({
      where: { companyId },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, total };
  }

  async findOne(id: string, companyId: string) {
    const project = await this.projectRepo.findByCondition({
      where: { id, companyId },
    });
    if (!project) {
      throw new HttpException('Project not found', HttpStatus.NOT_FOUND);
    }
    return project;
  }

  async update(
    id: string,
    updateProjectDto: UpdateProjectDto,
    companyId: string,
  ) {
    const project = await this.projectRepo.findByCondition({
      where: { id, companyId },
    });
    if (!project) {
      throw new HttpException('Project not found', HttpStatus.NOT_FOUND);
    }
    const update = await this.projectRepo.update(project.id, updateProjectDto);

    return await this.projectRepo.findByCondition({
      where: { id, companyId },
    });
  }

  async getMyProject(
    page: number,
    limit: number,
    projectName: string,
    status: string,
    userId: string,
    companyId: string,
  ) {
    return await this.projectToUserRepo.getMyProject(
      page,
      limit,
      projectName,
      status,
      userId,
      companyId,
    );
  }

  async assignUsersToProject(
    projectId: string,
    userIds: string[],
    companyId: string,
  ) {
    const alreadyAssign = await this.projectToUserRepo.findByCondition({
      where: { projectId, userId: In(userIds) },
      relations: ['project', 'user'],
    });
    if (alreadyAssign) {
      throw new HttpException(
        `Project was already assigned ${alreadyAssign.user.email}`,
        HttpStatus.CONFLICT,
      );
    }
    const isInThisCompany = await this.userService.areInTheSameCompany(
      userIds,
      companyId,
    );

    if (!isInThisCompany) {
      throw new HttpException(
        'Some of the user you are trying to assign is not in this company',
        HttpStatus.BAD_REQUEST,
      );
    }

    const projectToUsers = userIds.map((userId) =>
      this.projectToUserRepo.create([
        {
          userId,
          projectId,
        },
      ]),
    );
    return await this.projectToUserRepo.save(projectToUsers.flat());
  }
  async removeUserFromProjectBulk(ids: string[], projectId: string) {
    const projectAssignsConnection = this.projectToUserRepo.findByCondition({
      where: { userId: In(ids), projectId: Not(projectId) },
    });
    if (projectAssignsConnection) {
      throw new HttpException(
        'Some of the users you are trying to remove are not assigned to this project',
        HttpStatus.BAD_REQUEST,
      );
    }
    const deleteAssigns = await this.projectToUserRepo.delete(ids, projectId);

    return { message: 'User(s) removed from project' };
  }

  async getUsersAssignedToProject(
    page: number,
    limit: number,
    projectId: string,
    companyId: string,
  ) {
    return await this.projectToUserRepo.findAll({
      where: { projectId },
      skip: (page - 1) * limit,
      take: limit,
      relations: ['user'],
    });
  }
}
