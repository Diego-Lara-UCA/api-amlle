import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { entities } from 'src/models';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
            type: 'mssql',
            host: configService.get<string>('DB_HOST'),
            port: parseInt(configService.get<string>('DB_PORT', '1433'), 10),
            username: configService.get<string>('DB_USERNAME'),
            password: configService.get<string>('DB_PASSWORD'),
            database: configService.get<string>('DB_NAME'),
            autoLoadEntities: true,
            entities: entities, 
            synchronize: configService.get('DB_SYNCHRONIZE') === 'true',
            logging: false,
            ssl: {rejectUnauthorized: true},
            retryAttempts: 3,
            retryDelay: 2000,
            options: {
              encrypt: configService.get('DB_ENCRYPT') === 'true', 
              trustServerCertificate: configService.get('DB_TRUST_SERVER_CERTIFICATE') === 'true',
            }
        }),
        inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
