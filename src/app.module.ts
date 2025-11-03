import { MinutesService } from './models/minutes/minute.service';
import { AgreementModule } from './models/agreement/agreement.module';
import { MinutesModule } from './models/minutes/minute.module';
import { VolumeModule } from './models/volume/volume.module';
import { BookModule } from './models/book/book.module';
import { AuthModule } from './models/auth/auth.module';
import { UserModule } from './models/user/user.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { entities } from './models';
import { DatabaseModule } from './providers/database/database.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';

@Module({
  imports: [
    AgreementModule,
    MinutesModule,
    VolumeModule,
    BookModule,
    AuthModule,
    UserModule,
    ConfigModule.forRoot({
      isGlobal: true
    }),
    TypeOrmModule.forFeature(entities),
    DatabaseModule
  ],
  controllers: [],
  providers: [
    MinutesService, {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    }],
})
export class AppModule { }
