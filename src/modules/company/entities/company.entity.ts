import { User } from 'src/modules/user/entities/user.entity';
import { BaseEntity } from 'src/util/entities/base.entity';
import { Status } from 'src/util/types/status.enum';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity()
export class Company extends BaseEntity {
  @Column({ name: 'name', nullable: false, length: 256 })
  name: string;

  @Column({ name: 'description', nullable: false, length: 4000 })
  description: string;

  @Column({ name: 'logo', nullable: false, length: 512 })
  logo: string;

  @Column({ enum: [Status.ACTIVE, Status.INACTIVE], default: Status.ACTIVE })
  status: string;

  @OneToMany(() => User, (user) => user.company)
  users: User[];
}
