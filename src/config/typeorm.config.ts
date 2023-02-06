import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  TypeOrmModuleAsyncOptions,
  TypeOrmModuleOptions,
} from '@nestjs/typeorm';
import { join } from 'path';
import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';

dotenv.config();

export const typeOrmAsyncConfig: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (): Promise<TypeOrmModuleOptions> => {
    return {
      type: 'postgres',
      username: process.env.DATABASE_USERNAME,
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT),
      password: process.env.DATABASE_PASSWORD,
      entities: [join(__dirname, '/../**/*.entity.{ts,js}')],
      synchronize: true,
      // migrationsRun: true,
      // migrations: [__dirname + '/../database/migrations/*{.ts,.js}'],
      logging: true,
    };
  },
};

const dataSource = new DataSource({
  type: 'postgres',
  username: process.env.DATABASE_USERNAME,
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT),
  password: process.env.DATABASE_PASSWORD,
  entities: [join(__dirname, '/../**/*.entity.{ts,js}')],
  synchronize: true,
  migrationsRun: true,

  migrations: ['dist/database/migrations/*{.ts,.js}'],
  logging: true,
});

export default dataSource;
