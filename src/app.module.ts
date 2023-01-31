import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { APP_FILTER, APP_GUARD, Reflector } from '@nestjs/core';
import { JwtGuard } from './util/guards/jwt.guard';
import { AuthService } from './auth/auth.service';
import { JwtStrategy } from './util/jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmAsyncConfig } from './config/typeorm.config';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { CompanyModule } from './company/company.module';
import { ProjectModule } from './project/project.module';
import { GlobalExceptionFilter } from './util/common/global-exeption.filter';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '../.env' }),
    AuthModule,
    TypeOrmModule.forRootAsync(typeOrmAsyncConfig),
    UserModule,
    CompanyModule,
    ProjectModule,
    UploadModule,
  ],
  controllers: [AppController],
  providers: [
    JwtStrategy,
    {
      provide: APP_GUARD,
      useFactory: (ref) => new JwtGuard(ref),
      inject: [Reflector, AuthService],
    },
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
    AppService,
  ],
})
export class AppModule {}
