import {
  IsInt,
  IsOptional,
  IsPositive,
  IsEnum,
  IsString,
  ValidateNested,
  IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { VolumeState } from '../enums/volume-status.enum';
import { PdfSettings } from '../types/pdf-settings.type';

export class UpdateVolumeDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => PdfSettings)
  pdfSettings?: PdfSettings;

  @IsOptional()
  @IsInt()
  @IsPositive()
  number?: number;

  @IsOptional()
  @IsInt()
  pageCount?: number;

  @IsOptional()
  @IsEnum(VolumeState)
  status?: VolumeState;
  
  @IsOptional()
  @IsDateString()
  authorizationDate?: Date;

  @IsOptional()
  @IsDateString()
  closingDate?: Date;
}