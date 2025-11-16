import { BookState } from '../enums/book-state.enum';

export class GetBookManagementDto {
  id: string;
  name: string;
  status: BookState;
  createdAt: Date;
  authorizationDate: Date;
  closingDate: Date;
  createdByName: string;

  // Conteos
  volumeCount: number;
  minutesCount: number;
  agreementCount: number;

  // Auditoría
  latestModifierName: string | null;
  latestModificationDate: Date | null;
}