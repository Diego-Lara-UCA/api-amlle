import {
  IsString,
  IsOptional,
  IsEnum,
  IsDateString,
} from 'class-validator';
import { BookState } from 'src/models/book/enums/book-state.enum';
import { VolumeState } from 'src/models/volume/enums/volume-status.enum';
import { MinutesType } from 'src/models/minutes/enums/minutes-status.enum';

export enum SearchableEntityType {
  BOOKS = 'books',
  VOLUMES = 'volumes',
  MINUTES = 'minutes',
  AGREEMENTS = 'agreements',
}

export class SearchQueryDto {
  @IsString()
  @IsOptional()
  keyword?: string;

  @IsEnum(SearchableEntityType)
  @IsOptional()
  entityType?: SearchableEntityType;

  @IsEnum(BookState)
  @IsOptional()
  bookStatus?: BookState;

  @IsEnum(VolumeState)
  @IsOptional()
  volumeStatus?: VolumeState;

  @IsEnum(MinutesType)
  @IsOptional()
  minutesStatus?: MinutesType;

  @IsDateString()
  @IsOptional()
  dateFrom?: string;

  @IsDateString()
  @IsOptional()
  dateTo?: string;
}