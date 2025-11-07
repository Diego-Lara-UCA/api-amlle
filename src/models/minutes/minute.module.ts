import { MinuteController } from './minute.controller';
import { Module } from '@nestjs/common';
import { MinutesService } from './minute.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MinutesEntity } from './entities/minute.entity';
import { VolumeModule } from '../volume/volume.module';
import { UserService } from '../user/user.service';
import { UserModule } from '../user/user.module';
import { MinutesModification } from './entities/minutes-modification.entity';
import { PropietarioEntity } from './entities/propietario.entity';
import { SubstitutoEntity } from './entities/substituto.entity';
import { AttendanceEntity } from './entities/attendance.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([MinutesEntity, MinutesModification, PropietarioEntity, SubstitutoEntity, AttendanceEntity]),
        VolumeModule,
        UserModule
    ],
    controllers: [
        MinuteController,
    ],
    
    providers: [
        MinutesService
    ],

    exports: [
        MinutesService
    ]
})
export class MinutesModule { }
