import { IsString, IsOptional, IsDateString, IsEnum } from 'class-validator';
import { BookState } from '../enums/book-state.enum';

export class UpdateBookDto {
    @IsString()
    @IsOptional()
    name?: string;

    @IsDateString()
    @IsOptional()
    authorizationDate?: Date;

    @IsDateString()
    @IsOptional()
    closingDate?: Date;
}