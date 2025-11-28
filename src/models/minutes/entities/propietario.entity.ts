import {
  Column,
  Entity,
  ManyToMany,
  JoinTable,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import { SubstitutoEntity } from './substituto.entity';
import { AttendanceEntity } from './attendance.entity';
import { PropietarioType } from '../enums/propietario-type.enum';

@Entity('propietarios')
export class PropietarioEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({
    type: 'nvarchar',
    length: 100,
    nullable: false,
  })
  type: PropietarioType;

  @ManyToMany(() => SubstitutoEntity, (substituto) => substituto.canSubstituteFor)
  @JoinTable({
    name: 'propietario_substitutos_habilitados',
    joinColumn: { name: 'propietario_id' },
    inverseJoinColumn: { name: 'substituto_id' },
  })
  approvedSubstitutes: SubstitutoEntity[];

  @OneToMany(() => AttendanceEntity, (attendance) => attendance.propietarioConvocado)
  attendanceRecords: AttendanceEntity[];
}