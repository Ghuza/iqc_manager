import { BaseEntity } from 'src/util/entities/base.entity';
import { ProjectStatus, Status } from 'src/util/types/status.enum';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity()
export class Project extends BaseEntity {
  @Column({ name: 'name', nullable: false, length: 256 })
  name: string;

  @Column({ name: 'description', nullable: false, length: 4000 })
  description: string;

  @Column({ name: 'logo', nullable: false, length: 512 })
  logo: string;

  @Column({ name: 'company_id', nullable: false, length: 64 })
  companyId: string;

  @Column({
    enum: [
      ProjectStatus.DONE,
      ProjectStatus.NOT_STARTED,
      ProjectStatus.IN_PROGRESS,
    ],
    default: ProjectStatus.NOT_STARTED,
  })
  status: string;

  @OneToMany(() => Project, (project) => project.project)
  project: Project[];
}
