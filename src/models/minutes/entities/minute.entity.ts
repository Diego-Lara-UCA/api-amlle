import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  JoinTable,
  ManyToMany,
} from 'typeorm';
import { VolumeEntity } from 'src/models/volume/entities/volume.entity';
import { MinutesType } from '../enums/minutes-status.enum';
import { AgreementEntity } from 'src/models/agreement/entities/agreement.entity';
import { UserEntity } from 'src/models/user/entities/user.entity';
import { MinutesModification } from './minutes-modification.entity';
import { AttendanceEntity } from './attendance.entity';

@Entity('actas')
export class MinutesEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'int' })
  actNumber: number;

  @Column({ name: 'meeting_date', type: 'date', nullable: true })
  meetingDate: Date;

  @Column({ name: 'meeting_time', nullable: true })
  meetingTime: string;

  @Column({ name: 'description_html', type: 'nvarchar', length: 'max', nullable: true })
  bodyContent: string;

  @Column({
    type: 'nvarchar',
    length: 50,
    enum: MinutesType,
    default: MinutesType.ORDINARIA,
  })
  status: MinutesType;

  @ManyToOne(() => VolumeEntity, (volume) => volume.minutes, { 
    nullable: false, 
    onDelete: "CASCADE" 
  })
  @JoinColumn({ name: 'volume_id' })
  volume: VolumeEntity;

  @OneToMany(() => AttendanceEntity, (attendance) => attendance.minutes)
  attendanceList: AttendanceEntity[];

  @OneToMany(() => AgreementEntity, (agreement) => agreement.minutes)
  agreements: AgreementEntity[];

  @ManyToOne(() => UserEntity, (user) => user.createdMinutes, {
    nullable: false,
  })
  @JoinColumn({ name: 'created_by_id' })
  createdBy: UserEntity;

  @OneToMany(() => MinutesModification, (mod) => mod.minutes)
  modifications: MinutesModification[];

  @CreateDateColumn({
    type: 'datetime2',
    name: 'created_at',
    default: () => 'GETDATE()',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'datetime2',
    name: 'updated_at',
    default: () => 'GETDATE()',
    onUpdate: 'GETDATE()',
  })
  updatedAt: Date;
}