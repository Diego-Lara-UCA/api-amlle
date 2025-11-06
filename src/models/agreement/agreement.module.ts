import { AgreementService } from './agreement.service';
import { AgreementController } from './agreement.controller';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AgreementEntity } from './entities/agreement.entity';
import { UserModule } from '../user/user.module';
import { MinutesModule } from '../minutes/minute.module';
import { AgreementModification } from './entities/agreement-modification.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([AgreementEntity, AgreementModification]),
        UserModule,
        MinutesModule,
    ],
    controllers: [
        AgreementController
    ],
    providers: [
        AgreementService,
    ],
    exports: [
        AgreementService,
    ],
})
export class AgreementModule { }
