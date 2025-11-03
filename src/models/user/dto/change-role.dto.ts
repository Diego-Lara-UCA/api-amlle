import { IsEnum, IsNotEmpty } from 'class-validator';
import { Role } from '../enums/role.enum';

export class ChangeRoleDto {
  @IsEnum(Role)
  @IsNotEmpty()
  rol: Role;
}
