import { IsBoolean, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class AttendanceItemDto {
  @IsUUID()
  @IsNotEmpty()
  propietarioConvocadoId: string;

  @IsBoolean()
  @IsNotEmpty()
  asistioPropietario: boolean;

  @IsUUID()
  @IsOptional()
  substitutoAsistenteId?: string;
}