import {
  IsString,
  IsNumber,
  IsBoolean,
  IsIn,
  ValidateNested,
  IsDefined,
} from 'class-validator';
import { Type } from 'class-transformer';

const orientations = ['portrait', 'landscape'];
const positions = ['center', 'left', 'right'];

export class PdfMarginSettings {
  @IsNumber()
  @IsDefined()
  top: number;

  @IsNumber()
  @IsDefined()
  bottom: number;

  @IsNumber()
  @IsDefined()
  left: number;

  @IsNumber()
  @IsDefined()
  right: number;
}

export class PdfSettings {
  @IsString()
  @IsDefined()
  pageSize: string;

  @IsIn(orientations)
  @IsDefined()
  orientation: 'portrait' | 'landscape';

  @ValidateNested()
  @Type(() => PdfMarginSettings)
  @IsDefined()
  margins: PdfMarginSettings;

  @IsNumber()
  @IsDefined()
  lineHeight: number;

  @IsNumber()
  @IsDefined()
  fontSize: number;

  @IsBoolean()
  @IsDefined()
  enablePageNumbering: boolean;

  @IsNumber()
  @IsDefined()
  pageNumberingOffset: number;

  @IsIn(positions)
  @IsDefined()
  pageNumberingPosition: 'center' | 'left' | 'right';

  @IsString()
  @IsDefined()
  pageNumberingFormat: string;
}