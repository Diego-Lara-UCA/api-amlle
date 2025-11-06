import { VolumeEntity } from '../entities/volume.entity';
import { VolumeState } from '../enums/volume-status.enum';
import { PdfSettings } from '../types/pdf-settings.type';

export class GetVolumeResponseDto {
  id: string;
  number: number;
  pageCount: number;
  name: string;
  pdfSettings: PdfSettings;
  status: VolumeState;
  authorizationDate: Date;
  closingDate: Date;
  createdAt: Date;
  updatedAt: Date;

  bookId: string;
  bookName: string;
  createdById: string;
  createdByName: string;
  minutesIds: string[];
  agreementCount: number;
  modificationIds: string[];
  modificationName: string[];
  modificationDate: Date[];

  public static fromEntity(volume: VolumeEntity): GetVolumeResponseDto {
    const totalAgreements = volume.minutes
      ? volume.minutes.reduce((sum, minute) => {
          return sum + (minute.agreements ? minute.agreements.length : 0);
        }, 0)
      : 0;

    return {
      id: volume.id,
      number: volume.number,
      pageCount: volume.pageCount,
      name: volume.name,
      pdfSettings: volume.pdfSettings,
      status: volume.status,
      authorizationDate: volume.authorizationDate,
      closingDate: volume.closingDate,
      createdAt: volume.createdAt,
      updatedAt: volume.updatedAt,
      bookName: volume.book.name,
      bookId: volume.book?.id,
      createdById: volume.createdBy?.id,
      createdByName: volume.createdBy.nombre,
      minutesIds: volume.minutes ? volume.minutes.map(minute => minute.id) : [],
      modificationIds: volume.modifications ? volume.modifications.map(mod => mod.id) : [],
      modificationName: volume.modifications ? volume.modifications.map(mod => mod.modifier.nombre) : [],
      modificationDate: volume.modifications ? volume.modifications.map(mod => mod.modificationDate) : [],
      agreementCount: totalAgreements,
    };
  }
}
