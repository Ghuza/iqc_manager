import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../util/repository/base.repository';
import { ProjectToUser } from './entities/project-to-user.entity';

@Injectable()
export class ProjectToUserRepository extends BaseRepository<ProjectToUser> {
  constructor(
    @InjectRepository(ProjectToUser)
    private readonly projectToUserRepository: Repository<ProjectToUser>,
  ) {
    super(projectToUserRepository);
  }

  async delete(ids: string[], projectId: string) {
    const deleteAssigns = await this.projectToUserRepository
      .createQueryBuilder()
      .delete()
      .from(ProjectToUser)
      .where('userId IN (:...ids)', { ids })
      .andWhere('projectId = :projectId', { projectId })
      .execute();
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
}
