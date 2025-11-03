import { IsEnum, IsNotEmpty } from 'class-validator';
import { MinutesState } from '../enums/minutes-status.enum';

export class UpdateMinutesStatusDto {
  @IsEnum(MinutesState)
  @IsNotEmpty()
  status: MinutesState;
}
