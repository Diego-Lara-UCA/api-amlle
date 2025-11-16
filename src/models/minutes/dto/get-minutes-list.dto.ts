export class GetMinutesListDto {
  id: string;
  name: string;
  createdAt: Date;
  volumeId: string;
  volumeName: string;
  bookName: string;
  createdByName: string;
  agreementCount: number;
  latestModificationDate: Date | null;
  latestModifierName: string | null;
}