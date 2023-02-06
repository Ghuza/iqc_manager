import {
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  FindOperator,
  Repository,
  UpdateResult,
} from 'typeorm';

interface IDProperty {
  id: string;
}
type UpdateType =
  | string
  | string[]
  | {
      [key: string]: string | string[] | FindOperator<string>;
    };

export class BaseRepository<T extends IDProperty> {
  private entity: Repository<T>;
  protected constructor(entity: Repository<T>) {
    this.entity = entity;
  }

  public async save(data: DeepPartial<T[]>): Promise<T[]> {
    return await this.entity.save(data);
  }

  public async update(
    id: UpdateType,
    data: DeepPartial<T>,
  ): Promise<UpdateResult> {
    // @ts-ignore
    return await this.entity.update(id, data);
  }

  public create(data: DeepPartial<T[]>): DeepPartial<T[]> {
    return this.entity.create(data);
  }

  public async findByCondition(filterCondition: FindOneOptions<T>): Promise<T> {
    return await this.entity.findOne(filterCondition);
  }

  public async findAll(options?: FindManyOptions<T>): Promise<[T[], number]> {
    return await this.entity.findAndCount(options);
  }
}
