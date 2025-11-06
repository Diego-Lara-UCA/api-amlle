import {
    IsInt,
    IsNotEmpty,
    IsOptional,
    IsPositive,
    IsUUID,
    IsEnum,
} from 'class-validator';
import { VolumeState } from '../enums/volume-status.enum';

export class CreateVolumeDto {
    @IsInt()
    @IsPositive()
    number: number;

    @IsUUID()
    @IsNotEmpty()
    bookId: string;

    @IsOptional()
    @IsEnum(VolumeState)
    status?: VolumeState;
}