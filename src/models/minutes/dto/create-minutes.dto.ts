import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  IsDateString,
  IsArray,
} from 'class-validator';
import { MinutesType } from '../enums/minutes-status.enum';

export class CreateMinutesDto {
  @IsNotEmpty()
  volumeId: string;

  @IsNotEmpty()
  actNumber: number;

  @IsString()
  @IsOptional()
  name?: string;

  @IsDateString()
  @IsOptional()
  meetingDate: Date;

  @IsString()
  @IsOptional()
  meetingTime?: string;

  @IsOptional()
  type?: MinutesType;
}