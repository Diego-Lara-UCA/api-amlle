import { IsNotEmpty, IsString, IsUUID, MinLength } from 'class-validator';

export class SetPasswordDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  contrasena: string;

  @IsUUID()
  @IsNotEmpty()
  id: string;
}
