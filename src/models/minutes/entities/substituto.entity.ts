import {
  Column,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import { PropietarioEntity } from './propietario.entity';
import { AttendanceEntity } from './attendance.entity';
import { SubstitutoType } from '../enums/substituto-type.enum';

@Entity('substitutos')
export class SubstitutoEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({
    type: 'nvarchar',
    length: 100,
    nullable: true,
  })
  type: SubstitutoType;

  @Column({ type: 'bit', default: 1 })
  active: boolean;

  @ManyToMany(() => PropietarioEntity, (propietario) => propietario.approvedSubstitutes)
  canSubstituteFor: PropietarioEntity[];

  @OneToMany(() => AttendanceEntity, (attendance) => attendance.substitutoAsistente)
  attendedAsSubstitute: AttendanceEntity[];
}