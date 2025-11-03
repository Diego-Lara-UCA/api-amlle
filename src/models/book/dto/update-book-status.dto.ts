import { IsEnum, IsNotEmpty } from 'class-validator';
import { BookState } from '../enums/book-state.enum';

export class UpdateBookStatusDto {
  @IsEnum(BookState)
  @IsNotEmpty()
  status: BookState;
}
