import { Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { MinutesEntity } from "./minute.entity";
import { ParticipantAttendance } from "./participant-attendance.entity";

@Entity('participantes')
export class ParticipantsEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  // @Column({
  //   name: 'is_substitute',
  //   type: 'boolean',
  //   default: false,
  // })
  // isSubstitute: boolean; @TODO: Los propietarios tienen subsitutos propios (tabla propietarios y tabla substituto?)



  @OneToMany(() => ParticipantAttendance, (attendance) => attendance.attendee)
  attendances: ParticipantAttendance[];

  @OneToMany(() => ParticipantAttendance, (attendance) => attendance.substitutedOwner)
  substitutions: ParticipantAttendance[];
}