import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { APP_FILTER, APP_GUARD, Reflector } from '@nestjs/core';
import { JwtGuard } from './util/guards/jwt.guard';
import { AuthService } from './modules/auth/auth.service';
import { JwtStrategy } from './util/jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmAsyncConfig } from './config/typeorm.config';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './modules/user/user.module';
import { CompanyModule } from './modules/company/company.module';
import { ProjectModule } from './modules/project/project.module';
import { GlobalExceptionFilter } from './util/common/global-exception.filter';
import { UploadModule } from './modules/upload/upload.module';

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
