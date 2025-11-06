import { VolumeService } from './volume.service';
import { VolumeController } from './volume.controller';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VolumeEntity } from './entities/volume.entity';
import { BookModule } from '../book/book.module';
import { UserModule } from '../user/user.module';
import { VolumeModification } from './entities/volume-modification.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([VolumeEntity, VolumeModification]),
        BookModule,
        UserModule
    ],
    controllers: [
        VolumeController,
    ],
    providers: [
        VolumeService,
    ],
    exports: [
        VolumeService
    ]
})
export class VolumeModule { }
