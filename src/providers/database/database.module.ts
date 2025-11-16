import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { entities } from 'src/models';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
            type: 'mysql',
            host: configService.get<string>('DB_HOST'),
            port: configService.get<number>('DB_PORT'),
            username: configService.get<string>('DB_USERNAME'),
            password: configService.get<string>('DB_PASSWORD'),
            database: configService.get<string>('DB_NAME'),
            autoLoadEntities: true,
            entities: entities, 
            synchronize: true,
            logging: false,
            ssl: {rejectUnauthorized: true}, //@TODO: agregar a .env
            retryAttempts: 3,
            retryDelay: 2000,
            extra: {
              keepAlive: true,
              keepAliveInitialDelay: 30000
            }
        }),
        inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
