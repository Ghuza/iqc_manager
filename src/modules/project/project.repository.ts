import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../util/repository/base.repository';
import { Project } from './entities/project.entity';

@Injectable()
export class ProjectRepository extends BaseRepository<Project> {
  constructor(
    @InjectRepository(Project)
    private readonly ProjectRepository: Repository<Project>,
  ) {
    super(ProjectRepository);
  }
}
