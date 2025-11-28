import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { PropietarioType } from '../enums/propietario-type.enum';

export class CreatePropietarioDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(PropietarioType)
  @IsNotEmpty()
  type: PropietarioType;
}