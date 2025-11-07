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

  @IsNotEmpty()
  actNumber: number;

  @IsDateString()
  meetingDate: Date;

  @IsString()
  @IsOptional()
  meetingTime?: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  bodyContent?: string;

  @IsOptional()
  status?: MinutesType;
}