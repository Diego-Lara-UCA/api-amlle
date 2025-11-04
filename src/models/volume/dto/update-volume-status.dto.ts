import { IsEnum, IsNotEmpty } from 'class-validator';
import { VolumeState } from '../types/enums/volume-status.enum';

export class UpdateVolumeStatusDto {
    @IsEnum(VolumeState)
    @IsNotEmpty()
    status: VolumeState;
}