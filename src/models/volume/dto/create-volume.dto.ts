import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsUUID,
  IsEnum,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { VolumeState } from '../enums/volume-status.enum';
import { PdfSettings } from '../types/pdf-settings.type';

export class CreateVolumeDto {
  @IsInt()
  @IsPositive()
  number: number;

  @IsUUID()
  @IsNotEmpty()
  bookId: string;

  @IsString()
  @IsOptional()
  name?: string;
  
  @IsOptional()
  @ValidateNested()
  @Type(() => PdfSettings)
  pdfSettings?: PdfSettings;

  @IsOptional()
  @IsEnum(VolumeState)
  status?: VolumeState;
}