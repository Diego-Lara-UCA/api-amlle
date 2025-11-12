import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  OneToMany,
  ManyToMany,
} from 'typeorm';
import { Role } from '../enums/role.enum';
import Argon2idUtils from 'src/common/utils/argon2id.util';
import { BookEntity } from 'src/models/book/entities/book.entity';
import { VolumeEntity } from 'src/models/volume/entities/volume.entity';
import { MinutesEntity } from 'src/models/minutes/entities/minute.entity';
import { AgreementEntity } from 'src/models/agreement/entities/agreement.entity';
import { BookModification } from 'src/models/book/entities/book-modification.entity';
import { VolumeModification } from 'src/models/volume/entities/volume-modification.entity';
import { MinutesModification } from 'src/models/minutes/entities/minutes-modification.entity';
import { AgreementModification } from 'src/models/agreement/entities/agreement-modification.entity';
import { SessionType } from '../enums/session-type.enum';

@Entity('usuarios')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  nombre: string;

  @Column({ type: 'varchar', length: 255, select: false, default: null })
  contrasena: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.REGULAR,
  })
  rol: Role;

  @OneToMany(() => BookEntity, (book) => book.createdBy)
  librosCreados: BookEntity[];

  @OneToMany(() => VolumeEntity, (volume) => volume.createdBy)
  createdVolumes: VolumeEntity[];

  @OneToMany(() => MinutesEntity, (minute) => minute.createdBy)
  createdMinutes: MinutesEntity[];

  @OneToMany(() => AgreementEntity, (agreement) => agreement.createdBy)
  createdAgreements: AgreementEntity[];

  @OneToMany(() => BookModification, (mod) => mod.modifier)
  bookModifications: BookModification[];

  @OneToMany(() => VolumeModification, (mod) => mod.modifier)
  volumeModifications: VolumeModification[];

  @OneToMany(() => MinutesModification, (mod) => mod.modifier)
  minutesModifications: MinutesModification[];

  @OneToMany(() => AgreementModification, (mod) => mod.modifier)
  agreementModifications: AgreementModification[];

  @Column({ type: 'boolean', default: false })
  activo: boolean;

  @Column({
    type: 'enum',
    enum: SessionType,
    default: SessionType.TEMPORAL,
  })
  sessionType: SessionType;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
    default: null,
    name: 'session_duration',
  })
  sessionDuration: string; // (ej. '1d', '4h', '30m')

  @CreateDateColumn({
    type: 'timestamp',
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    name: 'updated_at',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updatedAt: Date;

  @BeforeInsert()
  async hashPassword() {
    if (this.contrasena) {
      this.contrasena = await Argon2idUtils.Encrypt(this.contrasena);
    }
  }
}
