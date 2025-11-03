import { IsEnum, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { Role } from '../enums/role.enum';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  nombre: string;
}
