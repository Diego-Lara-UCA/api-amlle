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
import { Public } from 'src/common/utils/decorators/public.decorator';

@Controller('api/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post("create")
  //@Roles(Role.ADMIN, Role.SUPERADMIN)
  @Public()
  async Create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const user = await this.userService.create(createUserDto);
    return {
      id: user.id,
    }
  }

  @Get("all")
  @Roles(Role.SUPERADMIN, Role.ADMIN)
  async FindAll(): Promise<UserEntity[]> {
    return this.userService.findAll();
  }

  @Get('find/:id')
  @Roles(Role.SUPERADMIN, Role.ADMIN)
  async FindOneById(@Param('id', ParseUUIDPipe) id: string): Promise<UserEntity> {
    return this.userService.findOneById(id);
  }

  @Get('find-by-name')
  @Public()
  async FindOneByName(@Body() data: CreateUserDto) {
    return (await this.userService.findOneByName(data.nombre)).id;
  }

  @Patch('update/profile/:id')
  @Roles(Role.SUPERADMIN, Role.ADMIN, Role.REGULAR)
  async Update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    return {
      id: (await this.userService.update(id, updateUserDto)).id
    };
  }

  @Delete('remove/:id')
  @Roles(Role.SUPERADMIN, Role.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  async Remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.userService.remove(id);
  }

  @Post('set-password/:id')
  @Public()
  async SetPassword(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() setPasswordDto: SetPasswordDto,
  ): Promise<{ message: string }> {
    await this.userService.setPassword(id, setPasswordDto);
    return { message: 'Contraseña establecida correctamente' };
  }

  @Patch('change-password/:id')
  @Roles(Role.SUPERADMIN, Role.ADMIN, Role.REGULAR)
  async ChangePassword(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() setPasswordDto: SetPasswordDto,
  ): Promise<{ message: string }> {
    await this.userService.ChangePassword(id, setPasswordDto);
    return { message: 'Contraseña establecida correctamente' };
  }

  @Patch('change-role/:id')
  @Roles(Role.SUPERADMIN, Role.ADMIN)
  ChangeRole(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() changeRoleDto: ChangeRoleDto,
  ): Promise<UserEntity> {
    return this.userService.changeRole(id, changeRoleDto);
  }
}
