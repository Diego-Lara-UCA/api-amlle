import { IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { SessionType } from '../enums/session-type.enum';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  nombre: string;

  @IsEnum(SessionType)
  @IsOptional()
  sessionType?: SessionType;

  @IsString()
  @IsOptional()
  sessionDuration?: string;
}
