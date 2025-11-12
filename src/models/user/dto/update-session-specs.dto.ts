import { IsEnum, IsNotEmpty, IsString, IsOptional, ValidateIf } from 'class-validator';
import { SessionType } from '../enums/session-type.enum';

export class UpdateSessionSpecsDto {
  @IsEnum(SessionType)
  @IsNotEmpty()
  sessionType: SessionType;

  @ValidateIf(o => o.sessionType === SessionType.TEMPORAL)
  @IsString()
  @IsNotEmpty()
  sessionDuration: string;
}