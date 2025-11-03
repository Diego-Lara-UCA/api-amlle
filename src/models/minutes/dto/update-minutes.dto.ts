import {
  IsString,
  IsOptional,
  IsDateString,
} from 'class-validator';

export class UpdateMinutesDto {
  @IsString()
  @IsOptional()
  number?: string;

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
}
