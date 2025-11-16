export class GetAgreementManagementDto {
  id: string;
  name: string;
  agreementNumber: number;
  createdAt: Date;
  createdByName: string | null;
  latestModifierName: string | null;
  latestModificationDate: Date | null;
  minutesId: string | null;
  minutesName: string | null;
  volumeId: string | null;
  volumeName: string | null;
  bookId: string | null;
  bookName: string | null;
}