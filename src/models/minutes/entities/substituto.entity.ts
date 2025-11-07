import {
  Column,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import { PropietarioEntity } from './propietario.entity';
import { AttendanceEntity } from './attendance.entity';

@Entity('substitutos')
export class SubstitutoEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @ManyToMany(() => PropietarioEntity, (propietario) => propietario.approvedSubstitutes)
  canSubstituteFor: PropietarioEntity[];

  @OneToMany(() => AttendanceEntity, (attendance) => attendance.substitutoAsistente)
  attendedAsSubstitute: AttendanceEntity[];
}