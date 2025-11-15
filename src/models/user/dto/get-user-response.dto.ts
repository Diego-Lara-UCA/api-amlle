import { UserEntity } from '../entities/user.entity';
import { Role } from '../enums/role.enum';
import { SessionType } from '../enums/session-type.enum';

export class GetUserResponseDto {
  id: string;
  nombre: string;
  rol: Role;
  activo: boolean;
  sessionType: SessionType;
  sessionDuration: string | null;
  createdAt: Date;
  updatedAt: Date;

  /**
   * Método estático para transformar una UserEntity en el DTO de respuesta.
   * Esto asegura que la 'contrasena' nunca se exponga.
   */
  public static fromEntity(user: UserEntity): GetUserResponseDto {
    return {
      id: user.id,
      nombre: user.nombre,
      rol: user.rol,
      activo: user.activo,
      sessionType: user.sessionType,
      sessionDuration: user.sessionDuration,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
