import { Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { MinutesEntity } from "./minute.entity";

@Entity('participantes')
export class ParticipantsEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({
    name: 'is_substitute',
    type: 'boolean',
    default: false,
  })
  isSubstitute: boolean;
  
  @ManyToMany(() => MinutesEntity, (minutes) => minutes.participants)
  minutes: MinutesEntity;
}