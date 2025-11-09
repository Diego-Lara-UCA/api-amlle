import { MinutesEntity } from "src/models/minutes/entities/minute.entity";
import { UserEntity } from "src/models/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { AgreementModification } from "./agreement-modification.entity";

@Entity('acuerdos')
export class AgreementEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  name: string;

  @Column({ type: 'int' })
  agreementNumber: number;

  @Column({ name: 'description_html', type: 'longtext', nullable: true })
  content: string;
  
  @ManyToOne(() => MinutesEntity, (minutes) => minutes.agreements)
  minutes: MinutesEntity;

  @ManyToOne(() => UserEntity, (user) => user.createdAgreements, {
    nullable: false,
  })
  @JoinColumn({ name: 'created_by_id' })
  createdBy: UserEntity;

  @OneToMany(() => AgreementModification, (mod) => mod.agreement)
  modifications: AgreementModification[];

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