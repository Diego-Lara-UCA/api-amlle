import { AgreementEntity } from "./agreement/entities/agreement.entity";
import { BookModification } from "./book/entities/book-modification.entity";
import { BookEntity } from "./book/entities/book.entity";
import { MinutesEntity } from "./minutes/entities/minute.entity";
import { MinutesModification } from "./minutes/entities/minutes-modification.entity";
import { ParticipantAttendance } from "./minutes/entities/participant-attendance.entity";
import { ParticipantsEntity } from "./minutes/entities/participants.entity";
import { UserEntity } from "./user/entities/user.entity";
import { VolumeModification } from "./volume/entities/volume-modification.entity";
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
    ParticipantsEntity,
    ParticipantAttendance,

    BookModification,
    VolumeModification,
    MinutesModification,
    VolumeModification
]
