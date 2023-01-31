import { User } from 'src/modules/user/entities/user.entity';
import { BaseEntity } from 'src/util/entities/base.entity';
import {
  Entity,
  Column,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';
import { Project } from './project.entity';

@Entity()
export class ProjectToUser extends BaseEntity {
  @Column({ name: 'project_id', nullable: false })
  public projectId: string;

  @Column({ name: 'user_id', nullable: false })
  public userId: string;

  @ManyToOne(() => Project, (Project) => Project.project)
  @JoinColumn({ name: 'project_id' })
  public project: Project;

  @ManyToOne(() => User, (User) => User.project)
  @JoinColumn({ name: 'user_id' })
  public user: User;
}
