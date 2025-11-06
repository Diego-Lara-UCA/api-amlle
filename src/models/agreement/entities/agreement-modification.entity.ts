import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from 'src/models/user/entities/user.entity';
import { AgreementEntity } from './agreement.entity';

@Entity('agreement_modifications')
export class AgreementModification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ name: 'modification_date', type: 'timestamp' })
  modificationDate: Date;

  @ManyToOne(() => UserEntity, (user) => user.agreementModifications, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  modifier: UserEntity;

  @ManyToOne(() => AgreementEntity, (agreement) => agreement.modifications, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'agreement_id' })
  agreement: AgreementEntity;
}