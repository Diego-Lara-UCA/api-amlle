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
  @IsUUID()
  @IsNotEmpty()
  volumeId: string;

  @IsString()
  @IsNotEmpty()
  number: string;

  @IsDateString()
  meetingDate: Date;

  @IsString()
  @IsOptional()
  meetingTime?: string;

  @IsString()
  @IsOptional()
  agenda?: string;

  @IsString()
  @IsOptional()
  bodyContent?: string;

  @IsOptional()
  status?: MinutesType;

  @IsArray()
  @IsUUID('all', { each: true })
  @IsOptional()
  participantIds?: string[];
}