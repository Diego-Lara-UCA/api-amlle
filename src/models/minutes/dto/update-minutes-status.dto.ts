import { IsEnum, IsNotEmpty } from 'class-validator';
import { MinutesType } from '../enums/minutes-status.enum';

export class UpdateMinutesStatusDto {
  @IsEnum(MinutesType)
  @IsNotEmpty()
  status: MinutesType;
}
