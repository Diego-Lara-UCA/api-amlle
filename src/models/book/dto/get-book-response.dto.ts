import { BookEntity } from '../entities/book.entity';
import { BookState } from '../enums/book-state.enum';

export class GetBookResponseDto {
  id: string;
  name: string;
  status: BookState;
  authorizationDate: Date;
  closingDate: Date;
  createdAt: Date;
  updatedAt: Date;

  createdById: string;
  createdByName: string;

  volumeCount: number;
  minutesCount: number;
  agreementCount: number;

  modificationIds: string[];
  modificationName: string[];
  modificationDate: Date[];

  public static fromEntity(book: BookEntity): GetBookResponseDto {
    const volumes = book.volumes || [];
    const volumeCount = volumes.length;
    
    const minutesCount = volumes.reduce((sum, volume) => {
      return sum + (volume.minutes ? volume.minutes.length : 0);
    }, 0);

    const agreementCount = volumes.reduce((sum, volume) => {
      const minutes = volume.minutes || [];
      return sum + minutes.reduce((minSum, minute) => {
        return minSum + (minute.agreements ? minute.agreements.length : 0);
      }, 0);
    }, 0);
    const modifications = book.modifications || [];
    
    return {
      id: book.id,
      name: book.name,
      status: book.status,
      authorizationDate: book.authorizationDate,
      closingDate: book.closingDate,
      createdAt: book.createdAt,
      updatedAt: book.updatedAt,
      
      createdById: book.createdBy?.id,
      createdByName: book.createdBy?.nombre || 'Usuario desconocido',
      
      volumeCount: volumeCount,
      minutesCount: minutesCount,
      agreementCount: agreementCount,

      modificationIds: modifications.map(mod => mod.id),
      modificationName: modifications.map(mod => mod.modifier?.nombre || 'Usuario desconocido'),
      modificationDate: modifications.map(mod => mod.modificationDate),
    };
  }
}
