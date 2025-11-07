import {
  IsString,
  IsOptional,
  IsDateString,
  IsArray,
  ValidateNested,
  IsInt,
  IsPositive,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { MinutesType } from '../enums/minutes-status.enum';
import { AttendanceItemDto } from './attendance-item.dto';

export class UpdateMinutesDto {
  @IsInt()
  @IsPositive()
  @IsOptional()
  actNumber?: number;

  @IsDateString()
  @IsOptional()
  meetingDate?: Date;

  @IsString()
  @IsOptional()
  meetingTime?: string;

  @IsString()
  @IsOptional()
  agenda?: string;

  @IsString()
  @IsOptional()
  bodyContent?: string;

  @IsEnum(MinutesType)
  @IsOptional()
  status?: MinutesType;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AttendanceItemDto)
  @IsOptional()
  attendanceList?: AttendanceItemDto[];
}
