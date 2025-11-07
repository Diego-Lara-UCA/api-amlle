import { AgreementEntity } from "./agreement/entities/agreement.entity";
import { BookModification } from "./book/entities/book-modification.entity";
import { BookEntity } from "./book/entities/book.entity";
import { AttendanceEntity } from "./minutes/entities/attendance.entity";
import { MinutesEntity } from "./minutes/entities/minute.entity";
import { MinutesModification } from "./minutes/entities/minutes-modification.entity";
import { PropietarioEntity } from "./minutes/entities/propietario.entity";
import { SubstitutoEntity } from "./minutes/entities/substituto.entity";
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
    PropietarioEntity,
    SubstitutoEntity,
    
    AttendanceEntity,
    BookModification,
    VolumeModification,
    MinutesModification,
    VolumeModification
]
