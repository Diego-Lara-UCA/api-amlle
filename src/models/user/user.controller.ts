import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { SetPasswordDto } from './dto/set-password.dto';
import { ChangeRoleDto } from './dto/change-role.dto';
import { UserEntity } from './entities/user.entity';
import { UserResponseDto } from './dto/user-response.dto';
import { Roles } from 'src/common/utils/decorators/roles.decorator';
import { Role } from './enums/role.enum';
import CryptoUtil from 'src/common/utils/crypto.util';

@Controller('api/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post("create")
  @Roles(Role.SUPERADMIN)
  async Create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const user = await this.userService.create(createUserDto);
    const password = CryptoUtil.Create12BytesString();
    console.log(password);
    
    await this.userService.setPassword(user.id, {contrasena: password});
    return {
      id: user.id,
      password: password
    }
  }

  @Get("all")
  @Roles(Role.SUPERADMIN)
  async FindAll(): Promise<UserEntity[]> {
    return this.userService.findAll();
  }

  @Get('find/:id')
  @Roles(Role.SUPERADMIN)
  async FindOneById(@Param('id', ParseUUIDPipe) id: string): Promise<UserEntity> {
    return this.userService.findOneById(id);
  }

  @Patch('update/profile/:id')
  @Roles(Role.SUPERADMIN)
  async Update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    return {
      id: (await this.userService.update(id, updateUserDto)).id
    };
  }

  @Delete('remove/:id')
  @Roles(Role.SUPERADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  async Remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.userService.remove(id);
  }

  @Post('set-password/:id')
  @Roles(Role.ADMIN, Role.REGULAR)
  async SetPassword(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() setPasswordDto: SetPasswordDto,
  ): Promise<{ message: string }> {
    await this.userService.setPassword(id, setPasswordDto);
    return { message: 'Contraseña establecida correctamente' };
  }

  @Patch('change-role/:id')
  @Roles(Role.SUPERADMIN)
  ChangeRole(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() changeRoleDto: ChangeRoleDto,
  ): Promise<UserEntity> {
    return this.userService.changeRole(id, changeRoleDto);
  }
}
