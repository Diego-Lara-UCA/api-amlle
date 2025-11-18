import { IsBoolean, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class AttendanceItemDto {
  @IsNotEmpty()
  propietarioConvocadoId: string;

  @IsNotEmpty()
  syndic: string;
  
  @IsNotEmpty()
  secretary: string;  

  @IsBoolean()
  @IsNotEmpty()
  asistioPropietario: boolean;

  @IsOptional()
  substitutoAsistenteId?: string;
}