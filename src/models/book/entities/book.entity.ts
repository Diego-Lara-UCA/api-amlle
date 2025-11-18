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
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { BookState } from '../enums/book-state.enum';
import { UserEntity } from 'src/models/user/entities/user.entity';
import { VolumeEntity } from 'src/models/volume/entities/volume.entity';
import { BookModification } from './book-modification.entity';

@Entity('libros')
export class BookEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({
    type: 'nvarchar',
    length: 50,
    enum: BookState,
    default: BookState.BORRADOR,
  })
  status: BookState;

  @ManyToOne(() => UserEntity, (user) => user.librosCreados, {
    nullable: false,
  })
  @JoinColumn({ name: 'created_by_id' })
  createdBy: UserEntity;

  @Column({
    name: 'authorization_date',
    type: 'date',
    nullable: true,
  })
  authorizationDate: Date;

  @Column({
    name: 'closing_date',
    type: 'date',
    nullable: true,
  })
  closingDate: Date;

  @OneToMany(() => BookModification, (mod) => mod.book)
  modifications: BookModification[];

  @OneToMany(() => VolumeEntity, (volume) => volume.book)
  volumes: VolumeEntity[];

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
