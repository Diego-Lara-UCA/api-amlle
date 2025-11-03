import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { VolumeState } from '../enums/volume-status.enum';
import { BookEntity } from 'src/models/book/entities/book.entity';
import { MinutesEntity } from 'src/models/minutes/entities/minute.entity';
import { UserEntity } from 'src/models/user/entities/user.entity';

@Entity('tomos')
export class VolumeEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int' })
  number: number;

  @Column({ type: 'int' })
  pageCount: number

  @Column({
    type: 'enum',
    enum: VolumeState,
    default: VolumeState.BORRADOR,
  })
  status: VolumeState;

  @ManyToOne(() => BookEntity, (book) => book.volumes, { nullable: false, onDelete: "CASCADE" })
  @JoinColumn({ name: 'book_id' })
  book: BookEntity;

  @OneToMany(() => MinutesEntity, (minutes) => minutes.volume)
  minutes: MinutesEntity[];

  @ManyToOne(() => UserEntity, (user) => user.createdVolumes, {
    nullable: false,
  })
  @JoinColumn({ name: 'created_by_id' })
  createdBy: UserEntity;

  @ManyToOne(() => UserEntity, (user) => user.volumesModified, {
    nullable: true,
  })
  @JoinColumn({ name: 'modified_by_id' })
  modifiedBy: UserEntity;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}