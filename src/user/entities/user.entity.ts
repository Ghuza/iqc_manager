import { Exclude } from 'class-transformer';
import { Company } from 'src/company/entities/company.entity';
import { Project } from 'src/project/entities/project.entity';
import { BaseEntity } from 'src/util/entities/base.entity';
import { Roles } from 'src/util/types/roles.enum';
import { Status } from 'src/util/types/status.enum';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

@Entity()
export class User extends BaseEntity {
  constructor(partial: Partial<User>) {
    super();
    Object.assign(this, partial);
  }
  @Column({ name: 'first_name', nullable: false, length: 64 })
  firstName: string;

  @Column({ name: 'last_name', nullable: false, length: 64 })
  lastName: string;

  @Column({ nullable: false, length: 320 })
  email: string;

  @Exclude({ toPlainOnly: true })
  @Column({ type: 'varchar', select: false, nullable: false, length: 64 })
  password: string;

  @Column({ enum: [Status.ACTIVE, Status.INACTIVE], default: Status.ACTIVE })
  status: string;

  @Column({
    enum: [Roles.USER, Roles.COMPANY_ADMIN, Roles.PORTAL_ADMIN],

    default: Roles.USER,
  })
  role: string;

  @Column({ name: 'company_id', nullable: true })
  companyId: string;

  @ManyToOne(() => Company, (company) => company.users)
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @OneToMany(() => Project, (project) => project.project)
  project: Project[];
}
