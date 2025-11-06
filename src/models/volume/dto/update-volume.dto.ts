import {
    IsInt,
    IsOptional,
    IsPositive,
    IsEnum,
} from 'class-validator';
import { VolumeState } from '../enums/volume-status.enum';

export class UpdateVolumeDto {
    @IsOptional()
    @IsInt()
    @IsPositive()
    number?: number;

    @IsOptional()
    @IsEnum(VolumeState)
    status?: VolumeState;
}