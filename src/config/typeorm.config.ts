import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  TypeOrmModuleAsyncOptions,
  TypeOrmModuleOptions,
} from '@nestjs/typeorm';
import { join } from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

console.log(process.env.DATABASE_USERNAME);
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

      migrations: [__dirname + '/../database/migrations/*{.ts,.js}'],
      // cli: {
      //   migrationsDir: __dirname + '/../database/migrations',
      // },
      logging: true,
    };
  },
};

// export const typeOrmConfig: TypeOrmModuleOptions = {
//   type: 'postgres',
//   url: process.env.DATABASE,
//   entities: [join(__dirname, '/../**/*.entity.{ts,js}')],
//   ssl: true,
//   synchronize: true,
//   extra: {
//     charset: 'utf8mb4_unicode_ci',
//     ssl: {
//       rejectUnauthorized: false,
//     },
//   },
//   migrations: [__dirname + '/../database/migrations/*{.ts,.js}'],
//   // cli: {
//   //   migrationsDir: __dirname + '/../database/migrations',
//   // },
//   logging: true,
// };
