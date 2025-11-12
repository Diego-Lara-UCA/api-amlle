import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  MethodNotAllowedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserEntity } from './entities/user.entity';
import { Role } from './enums/role.enum';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { SetPasswordDto } from './dto/set-password.dto';
import { ChangeRoleDto } from './dto/change-role.dto';
import Argon2idUtils from 'src/common/utils/argon2id.util';
import { use } from 'passport';
import { UpdateSessionSpecsDto } from './dto/update-session-specs.dto';
import { SessionType } from './enums/session-type.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    const existingUser = await this.userRepository.findOneBy({
      nombre: createUserDto.nombre,
    });
    if (existingUser) {
      throw new ConflictException('El nombre de usuario ya está en uso');
    }

    const newUser = this.userRepository.create(createUserDto);
    return this.userRepository.save(newUser);
  }

  async findAll(): Promise<UserEntity[]> {
    return this.userRepository.find();
  }

  async findOneById(id: string): Promise<UserEntity> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`Usuario con ID '${id}' no encontrado`);
    }
    return user;
  }

  async findOneByName(name: string): Promise<UserEntity> {
    const user = await this.userRepository.findOneBy({ nombre: name });
    if (!user) {
      throw new NotFoundException(`Usuario con nombre '${name}' no encontrado`);
    }
    return user;
  }

  async findUserByNombreForAuth(name: string): Promise<UserEntity | null> {
    return this.userRepository
      .createQueryBuilder('user')
      .where('user.nombre = :name', { name })
      .addSelect('user.contrasena')
      .getOne();
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserEntity> {
    const user = await this.userRepository.preload({
      id,
      ...updateUserDto,
    });

    if (!user) {
      throw new NotFoundException(`Usuario con ID '${id}' no encontrado`);
    }

    return this.userRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Usuario con ID '${id}' no encontrado`);
    }
  }

  async setPassword(id: string, setPasswordDto: SetPasswordDto): Promise<void> {
    const user = await this.findOneById(id);

    if (!user) {
      throw new NotFoundException(`Usuario con ID '${id}' no encontrado`);
    }

    if (user.activo) {
      throw new ConflictException(`Usuario con ID ${id} ya se encuentra activado`)
    }

    user.contrasena = await Argon2idUtils.Encrypt(setPasswordDto.contrasena);
    user.activo = true;
    await this.userRepository.save(user);
  }

    async ChangePassword(id: string, setPasswordDto: SetPasswordDto): Promise<void> {
    const user = await this.findOneById(id);

    if (!user) {
      throw new NotFoundException(`Usuario con ID '${id}' no encontrado`);
    }

    const { contrasena } = setPasswordDto;
    user.contrasena = await Argon2idUtils.Encrypt(setPasswordDto.contrasena);
    await this.userRepository.save(user);
  }

  async changeRole(id: string, changeRoleDto: ChangeRoleDto): Promise<UserEntity> {
    const user = await this.findOneById(id);
    const { rol } = changeRoleDto;

    user.rol = rol;
    return this.userRepository.save(user);
  }

  async deactivate(id: string): Promise<UserEntity> {
    const user = await this.findOneById(id);
    if (!user.activo) {
      throw new ConflictException(`El usuario con ID ${id} ya está inactivo.`);
    }

    user.activo = false;
    return this.userRepository.save(user);
  }

  async updateSessionSpecs(
    id: string,
    dto: UpdateSessionSpecsDto,
  ): Promise<UserEntity> {
    const user = await this.findOneById(id);

    user.sessionType = dto.sessionType;
    
    if (dto.sessionType === SessionType.TEMPORAL) {
      user.sessionDuration = dto.sessionDuration;
    }

    return this.userRepository.save(user);
  }
}
