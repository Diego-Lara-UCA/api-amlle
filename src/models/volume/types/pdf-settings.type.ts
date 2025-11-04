export class PdfMarginSettings {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

export type PdfOrientation = 'portrait' | 'landscape';
export type PdfPageNumberingPosition = 'center' | 'left' | 'right';
export type PdfPageNumberingFormat = 'simple' | 'roman';

export class PdfSettings {
  pageSize: string;
  orientation: PdfOrientation;
  margins: PdfMarginSettings;
  lineHeight: number;
  fontSize: number;
  enablePageNumbering: boolean;
  pageNumberingOffset: number;
  pageNumberingPosition: PdfPageNumberingPosition;
  pageNumberingFormat: string;
}