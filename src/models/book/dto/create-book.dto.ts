import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsDateString,
} from 'class-validator';
import { BookState } from '../enums/book-state.enum';


export class CreateBookDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsEnum(BookState)
  status?: BookState;

  @IsOptional()
  @IsDateString()
  authorizationDate?: Date;
}