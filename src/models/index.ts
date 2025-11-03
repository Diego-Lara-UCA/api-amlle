import { AgreementEntity } from "./agreement/entities/agreement.entity";
import { BookEntity } from "./book/entities/book.entity";
import { MinutesEntity } from "./minutes/entities/minute.entity";
import { ParticipantsEntity } from "./minutes/entities/participants.entity";
import { UserEntity } from "./user/entities/user.entity";
import { VolumeEntity } from "./volume/entities/volume.entity";

export  const entities = [
    /**
     * List of all entities
     */
    UserEntity,
    BookEntity,
    VolumeEntity,
    MinutesEntity,
    AgreementEntity,
    ParticipantsEntity
]
