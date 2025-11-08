import { IsBoolean, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class AttendanceItemDto {
  @IsUUID()
  @IsNotEmpty()
  propietarioConvocadoId: string;

  @IsNotEmpty()
  syndic: string;
  
  @IsNotEmpty()
  secretary: string;  

  @IsBoolean()
  @IsNotEmpty()
  asistioPropietario: boolean;

  @IsUUID()
  @IsOptional()
  substitutoAsistenteId?: string;
}