import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { BookState } from '../enums/book-state.enum';
import { UserEntity } from 'src/models/user/entities/user.entity';
import { VolumeEntity } from 'src/models/volume/entities/volume.entity';

@Entity('libros')
export class BookEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({
    type: 'enum',
    enum: BookState,
    default: BookState.BORRADOR,
  })
  status: BookState;

  @ManyToOne(() => UserEntity, (user) => user.librosCreados, {
    nullable: false,
  })
  @JoinColumn({ name: 'created_by_id' })
  createdBy: UserEntity;

  @Column({ type: 'int', default: null })
  pageCount: number;

  @Column({
    name: 'authorization_date',
    type: 'date',
    nullable: true,
  })
  authorizationDate: Date;

  @ManyToOne(() => UserEntity, (user) => user.booksModified, {
    nullable: true,
  })
  @JoinColumn({ name: 'modified_by_id' })
  modifiedBy: UserEntity;

  @OneToMany(() => VolumeEntity, (volume) => volume.book)
  volumes: VolumeEntity[];

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
}
