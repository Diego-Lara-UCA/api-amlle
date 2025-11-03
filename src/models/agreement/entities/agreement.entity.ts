import { MinutesEntity } from "src/models/minutes/entities/minute.entity";
import { UserEntity } from "src/models/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('acuerdos')
export class AgreementEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'description_html', type: 'longtext', nullable: true })
  content: string;
  
  @ManyToOne(() => MinutesEntity, (minutes) => minutes.agreements)
  minutes: MinutesEntity;

  @ManyToOne(() => UserEntity, (user) => user.createdAgreements, {
    nullable: false,
  })
  @JoinColumn({ name: 'created_by_id' })
  createdBy: UserEntity;

  @ManyToOne(() => UserEntity, (user) => user.agreementModified, {
    nullable: true,
  })
  @JoinColumn({ name: 'modified_by_id' })
  modifiedBy: UserEntity;

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