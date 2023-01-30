import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { ProjectToUser } from './entities/project-to-user.entity';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Project, ProjectToUser]), UserModule],
  controllers: [ProjectController],
  providers: [ProjectService],
})
export class ProjectModule {}
