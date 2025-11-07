import {
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MinutesEntity } from './minute.entity';
import { ParticipantsEntity } from './participants.entity';

@Entity('participant_attendance')
export class ParticipantAttendance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => MinutesEntity, (minutes) => minutes.attendance, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'minutes_id' })
  minutes: MinutesEntity;

  @ManyToOne(() => ParticipantsEntity, (participant) => participant.attendances, {
    nullable: false,
  })
  @JoinColumn({ name: 'attendee_id' })
  attendee: ParticipantsEntity;

  @ManyToOne(() => ParticipantsEntity, (participant) => participant.substitutions, {
    nullable: true,
  })
  @JoinColumn({ name: 'substituted_owner_id' })
  substitutedOwner: ParticipantsEntity;
}
