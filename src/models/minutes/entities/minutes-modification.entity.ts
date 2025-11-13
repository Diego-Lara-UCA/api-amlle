import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from 'src/models/user/entities/user.entity';
import { MinutesEntity } from './minute.entity';

@Entity('minutes_modifications')
export class MinutesModification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ name: 'modification_date', type: 'timestamp' })
  modificationDate: Date;

  @ManyToOne(() => UserEntity, (user) => user.minutesModifications, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  modifier: UserEntity;

  @ManyToOne(() => MinutesEntity, (minutes) => minutes.modifications, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'minutes_id' })
  minutes: MinutesEntity;
}