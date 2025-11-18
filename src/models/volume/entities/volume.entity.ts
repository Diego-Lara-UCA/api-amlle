import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { VolumeState } from '../enums/volume-status.enum';
import { BookEntity } from 'src/models/book/entities/book.entity';
import { MinutesEntity } from 'src/models/minutes/entities/minute.entity';
import { UserEntity } from 'src/models/user/entities/user.entity';
import { PdfSettings } from '../types/pdf-settings.type';
import { VolumeModification } from './volume-modification.entity';
import { JsonTransformer } from 'src/common/utils/json-transformer.util';

@Entity('tomos')
export class VolumeEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  name: string;
  
  @Column({ type: 'nvarchar', length: 'max', nullable: true, transformer: new JsonTransformer()})
  pdfSettings: PdfSettings;

  @Column({ type: 'int' })
  number: number;

  @Column({ type: 'int', default: 0 },)
  pageCount: number

  @Column({
    type: 'nvarchar',
    length: 50,
    enum: VolumeState,
    default: VolumeState.BORRADOR,
  })
  status: VolumeState;

  @ManyToOne(() => BookEntity, (book) => book.volumes, { 
    nullable: false, 
    onDelete: "CASCADE" 
  })
  @JoinColumn({ name: 'book_id' })
  book: BookEntity;

  @OneToMany(() => MinutesEntity, (minutes) => minutes.volume)
  minutes: MinutesEntity[];

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

  @ManyToOne(() => UserEntity, (user) => user.createdVolumes, {
    nullable: false,
    onDelete: "NO ACTION"
  })
  @JoinColumn({ name: 'created_by_id' })
  createdBy: UserEntity;

  @OneToMany(() => VolumeModification, (mod) => mod.volume)
  modifications: VolumeModification[];

  @CreateDateColumn({ name: 'created_at', type: 'datetime2' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime2' })
  updatedAt: Date;
}