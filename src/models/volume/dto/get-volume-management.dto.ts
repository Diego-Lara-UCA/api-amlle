import { VolumeState } from '../enums/volume-status.enum';

export class GetVolumeManagementDto {
  id: string;
  name: string;
  pageCount: number;
  number: number;
  agreementCount: number;
  minutesCount: number;
  createdByName: string;
  createdAt: Date;
  latestModifierName: string | null;
  latestModificationDate: Date | null;
  status: VolumeState;
  bookId: string;
  bookName: string;
}