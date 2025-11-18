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

  @Column({ name: 'description_html', type: 'nvarchar', length: 'max', nullable: true })
  content: string;
  
  @ManyToOne(() => MinutesEntity, (minutes) => minutes.agreements, {
    nullable: false,
    onDelete: 'CASCADE'
  })
  minutes: MinutesEntity;

  @ManyToOne(() => UserEntity, (user) => user.createdAgreements, {
    nullable: false,
    onDelete: 'NO ACTION'
  })
  @JoinColumn({ name: 'created_by_id' })
  createdBy: UserEntity;

  @OneToMany(() => AgreementModification, (mod) => mod.agreement)
  modifications: AgreementModification[];

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