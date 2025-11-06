import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from 'src/models/user/entities/user.entity';
import { BookEntity } from './book.entity';

@Entity('book_modifications')
export class BookModification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ name: 'modification_date', type: 'timestamp' })
  modificationDate: Date;

  @ManyToOne(() => UserEntity, (user) => user.bookModifications, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  modifier: UserEntity;

  @ManyToOne(() => BookEntity, (book) => book.modifications, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'book_id' })
  book: BookEntity;
}