import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from 'src/models/user/entities/user.entity';
import { VolumeEntity } from './volume.entity';

@Entity('volume_modifications')
export class VolumeModification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ name: 'modification_date', type: 'datetime2' })
  modificationDate: Date;

  @ManyToOne(() => UserEntity, (user) => user.volumeModifications, { nullable: false, onDelete: "NO ACTION" })
  @JoinColumn({ name: 'user_id' })
  modifier: UserEntity;

  @ManyToOne(() => VolumeEntity, (volume) => volume.modifications, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'volume_id' })
  volume: VolumeEntity;
}