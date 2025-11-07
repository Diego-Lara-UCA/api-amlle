import { MinuteController } from './minute.controller';
import { Module } from '@nestjs/common';
import { MinutesService } from './minute.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MinutesEntity } from './entities/minute.entity';
import { ParticipantsEntity } from './entities/participants.entity';
import { VolumeModule } from '../volume/volume.module';
import { UserService } from '../user/user.service';
import { UserModule } from '../user/user.module';
import { MinutesModification } from './entities/minutes-modification.entity';
import { ParticipantAttendance } from './entities/participant-attendance.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([MinutesEntity, ParticipantsEntity, MinutesModification, ParticipantAttendance]),
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
