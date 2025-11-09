import { AgreementEntity } from '../entities/agreement.entity';

export class GetAgreementResponseDto {
  id: string;
  name: string;
  agreementNumber: number;
  content: string;
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

  public static fromEntity(agreement: AgreementEntity): GetAgreementResponseDto {
    
    let latestModDate: Date | null = null;
    let latestModName: string | null = null;

    if (agreement.modifications && agreement.modifications.length > 0) {
      const sortedMods = [...agreement.modifications].sort(
        (a, b) => b.modificationDate.getTime() - a.modificationDate.getTime(),
      );
      const latestMod = sortedMods[0];
      latestModDate = latestMod.modificationDate;
      if (latestMod.modifier) {
        latestModName = latestMod.modifier.nombre;
      }
    }

    const minutes = agreement.minutes;
    const volume = minutes?.volume;
    const book = volume?.book;

    return {
      id: agreement.id,
      name: agreement.name,
      agreementNumber: agreement.agreementNumber,
      content: agreement.content,
      createdAt: agreement.createdAt,
      
      createdByName: agreement.createdBy?.nombre || 'Usuario desconocido',
      
      latestModifierName: latestModName,
      latestModificationDate: latestModDate,
      
      minutesId: minutes?.id || null,
      minutesName: minutes?.name || null,
      volumeId: volume?.id || null,
      volumeName: volume?.name || null,
      bookId: book?.id || null,
      bookName: book?.name || null,
    };
  }
}
