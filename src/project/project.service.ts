import {
  HttpCode,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InstanceLinksHost } from '@nestjs/core/injector/instance-links-host';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/user/user.service';
import { In, Repository } from 'typeorm';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectToUser } from './entities/project-to-user.entity';
import { Project } from './entities/project.entity';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(ProjectToUser)
    private readonly projectToUserRepository: Repository<ProjectToUser>,
    private readonly userService: UserService,
  ) {}
  async create(createProjectDto: CreateProjectDto, companyId: string) {
    const project = this.projectRepository.create({
      ...createProjectDto,
      companyId,
    });
    const savedProject = await this.projectRepository.save(project);
    return savedProject;
  }

  findAll(page: number, limit: number, companyId: string) {
    return this.projectRepository.find({
      where: { companyId },
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  async findOne(id: string, companyId: string) {
    const project = await this.projectRepository.findOne({
      where: { id, companyId },
    });
    if (!project) {
      throw new HttpException('Project not found', 404);
    }
    return project;
  }

  async update(
    id: string,
    updateProjectDto: UpdateProjectDto,
    companyId: string,
  ) {
    const project = await this.projectRepository.findOne({
      where: { id, companyId },
    });
    if (!project) {
      throw new HttpException('Project not found', 404);
    }
    const update = this.projectRepository.update(project.id, updateProjectDto);

    return await this.projectRepository.findOne({
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
    const [data, total] = await this.projectToUserRepository
      .createQueryBuilder('projectToUser')
      .leftJoinAndSelect('projectToUser.project', 'project')
      .leftJoinAndSelect('projectToUser.user', 'user')
      .where('user.id = :userId', { userId })
      .andWhere('project.companyId = :companyId', { companyId })
      .andWhere('project.name ILIKE :projectName', {
        projectName: `%${projectName}%`,
      })
      .andWhere('project.status = :status', { status })
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return { data, total };
  }

  async assignUsersToProject(
    projectId: string,
    userIds: string[],
    companyId: string,
  ) {
    const alreadyAssign = await this.projectToUserRepository.findOne({
      where: { projectId, userId: In(userIds) },
      relations: ['project', 'user'],
    });
    if (alreadyAssign) {
      throw new HttpException(
        `Project was already assigned ${alreadyAssign.user.email}`,
        HttpStatus.CONFLICT,
      );
    }
    // validate that this users are in this company
    const isInThisCompany = await this.userService.areInTheSameCompany(
      userIds,
      companyId,
    );

    if (!isInThisCompany) {
      throw new HttpException(
        'Some of the user you are trying to assign is not in this company',
        400,
      );
    }

    const projectToUsers = userIds.map((userId) =>
      this.projectToUserRepository.create({
        projectId,
        userId,
      }),
    );
    return await this.projectToUserRepository.save(projectToUsers);
  }
  async removeUserFromProjectBulk(ids: string[], projectId: string) {
    const deleteAssigns = await this.projectToUserRepository
      .createQueryBuilder()
      .delete()
      .from(ProjectToUser)
      .where('userId IN (:...ids)', { ids })
      .andWhere('projectId = :projectId', { projectId })
      .execute();

    return { message: 'User(s) removed from project' };
  }

  async getUsersAssignedToProject(
    page: number,
    limit: number,
    projectId: string,
    companyId: string,
  ) {
    return await this.projectToUserRepository.find({
      where: { projectId },
      skip: (page - 1) * limit,
      take: limit,
      relations: ['user'],
    });
  }
}
