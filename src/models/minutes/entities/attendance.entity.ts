import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MinutesEntity } from './minute.entity';
import { PropietarioEntity } from './propietario.entity';
import { SubstitutoEntity } from './substituto.entity';

@Entity('asistencia_acta')
export class AttendanceEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  syndic: string;

  @Column({ type: 'varchar', length: 100 })
  secretary: string;

  @ManyToOne(() => MinutesEntity, (minutes) => minutes.attendanceList, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'minutes_id' })
  minutes: MinutesEntity;

  @ManyToOne(() => PropietarioEntity, (propietario) => propietario.attendanceRecords, {
    nullable: false,
  })
  @JoinColumn({ name: 'propietario_convocado_id' })
  propietarioConvocado: PropietarioEntity;

  @Column({ name: 'asistio_propietario', type: 'bit', default: false })
  asistioPropietario: boolean;

  @ManyToOne(() => SubstitutoEntity, (substituto) => substituto.attendedAsSubstitute, {
    nullable: true,
  })
  @JoinColumn({ name: 'substituto_asistente_id' })
  substitutoAsistente: SubstitutoEntity;
}