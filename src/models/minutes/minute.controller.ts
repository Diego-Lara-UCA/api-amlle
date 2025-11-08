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
import { CreateMinutesDto } from './dto/create-minutes.dto';
import { UpdateMinutesDto } from './dto/update-minutes.dto';
import { Roles } from 'src/common/utils/decorators/roles.decorator';
import { Role } from 'src/models/user/enums/role.enum';
import { User } from 'src/common/utils/decorators/user.decorator';
import { MinutesService } from './minute.service';
import { CreatePropietarioDto } from './dto/create-propietario.dto';
import { UpdatePropietarioDto } from './dto/update-propietario.dto';
import { CreateSubstitutoDto } from './dto/create-substituto.dto';
import { UpdateSubstitutoDto } from './dto/update-substituto.dto';
import { AssignSubstitutoDto } from './dto/assign-substituto.dto';
import { UpdateMinutesNameNumberDto } from './dto/update-minutes-name-number.dto';

@Controller('api/')
export class MinuteController {
  constructor(
    private readonly minutesService: MinutesService
  ) { }

  @Post('minutes/create')
  @Roles(Role.SUPERADMIN, Role.ADMIN, Role.REGULAR)
  createMinutes(
    @Body() createDto: CreateMinutesDto,
    @User('userId') userId: string,
  ) {
    return this.minutesService.createMinutes(createDto, userId);
  }

  @Get('minutes/find-all-by-volume/:volumeId')
  @Roles(Role.SUPERADMIN, Role.ADMIN, Role.REGULAR)
  findAllMinutesByVolume(@Param('volumeId', ParseUUIDPipe) volumeId: string) {
    return this.minutesService.findAllMinutesByVolume(volumeId);
  }

  @Get('minutes/find/:id')
  @Roles(Role.SUPERADMIN, Role.ADMIN, Role.REGULAR)
  findOneMinutes(@Param('id', ParseUUIDPipe) id: string) {
    return this.minutesService.findOneMinutes(id);
  }

  @Patch('minutes/update/:id')
  @Roles(Role.SUPERADMIN, Role.ADMIN, Role.REGULAR)
  updateMinutes(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateMinutesDto,
    @User('userId') userId: string,
  ) {
    return this.minutesService.updateMinutes(id, updateDto, userId);
  }

  @Delete('minutes/delete/:id')
  @Roles(Role.SUPERADMIN, Role.ADMIN, Role.REGULAR)
  @HttpCode(HttpStatus.NO_CONTENT)
  removeMinutes(@Param('id', ParseUUIDPipe) id: string) {
    return this.minutesService.removeMinutes(id);
  }

  @Patch('update-name-number/:id')
  @Roles(Role.SUPERADMIN, Role.ADMIN, Role.REGULAR)
  updateNameAndNumber(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateMinutesNameNumberDto,
    @User('userId') userId: string,
  ) {
    return this.minutesService.updateNameAndNumber(id, dto, userId);
  }

  @Post('participants/propietarios')
  @Roles(Role.SUPERADMIN, Role.ADMIN, Role.REGULAR)
  createPropietario(@Body() dto: CreatePropietarioDto) {
    return this.minutesService.createPropietario(dto);
  }

  @Get('participants/propietarios')
  @Roles(Role.SUPERADMIN, Role.ADMIN, Role.REGULAR)
  findAllPropietarios() {
    return this.minutesService.findAllPropietarios();
  }

  @Get('participants/propietarios/:id')
  @Roles(Role.SUPERADMIN, Role.ADMIN, Role.REGULAR)
  findOnePropietario(@Param('id', ParseUUIDPipe) id: string) {
    return this.minutesService.findOnePropietario(id);
  }

  @Patch('participants/propietarios/:id')
  @Roles(Role.SUPERADMIN, Role.ADMIN, Role.REGULAR)
  updatePropietario(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdatePropietarioDto,
  ) {
    return this.minutesService.updatePropietario(id, dto);
  }

  @Delete('participants/propietarios/:id')
  @Roles(Role.SUPERADMIN, Role.ADMIN, Role.REGULAR)
  @HttpCode(HttpStatus.NO_CONTENT)
  removePropietario(@Param('id', ParseUUIDPipe) id: string) {
    return this.minutesService.removePropietario(id);
  }

  @Post('participants/substitutos')
  @Roles(Role.SUPERADMIN, Role.ADMIN, Role.REGULAR)
  createSubstituto(@Body() dto: CreateSubstitutoDto) {
    return this.minutesService.createSubstituto(dto);
  }

  @Get('participants/substitutos')
  @Roles(Role.SUPERADMIN, Role.ADMIN, Role.REGULAR)
  findAllSubstitutos() {
    return this.minutesService.findAllSubstitutos();
  }

  @Get('participants/substitutos/:id')
  @Roles(Role.SUPERADMIN, Role.ADMIN, Role.REGULAR)
  findOneSubstituto(@Param('id', ParseUUIDPipe) id: string) {
    return this.minutesService.findOneSubstituto(id);
  }

  @Patch('participants/substitutos/:id')
  @Roles(Role.SUPERADMIN, Role.ADMIN, Role.REGULAR)
  updateSubstituto(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateSubstitutoDto,
  ) {
    return this.minutesService.updateSubstituto(id, dto);
  }

  @Delete('participants/substitutos/:id')
  @Roles(Role.SUPERADMIN, Role.ADMIN, Role.REGULAR)
  @HttpCode(HttpStatus.NO_CONTENT)
  removeSubstituto(@Param('id', ParseUUIDPipe) id: string) {
    return this.minutesService.removeSubstituto(id);
  }

  @Post('participants/propietarios/:id/assign-substituto')
  @Roles(Role.SUPERADMIN, Role.ADMIN, Role.REGULAR)
  assignSubstituto(
    @Param('id', ParseUUIDPipe) propietarioId: string,
    @Body() dto: AssignSubstitutoDto,
  ) {
    return this.minutesService.assignSubstituto(propietarioId, dto.substitutoId);
  }

  @Delete('participants/propietarios/:id/remove-substituto/:substitutoId')
  @Roles(Role.SUPERADMIN, Role.ADMIN, Role.REGULAR)
  @HttpCode(HttpStatus.NO_CONTENT)
  removeSubstitutoFromPropietario(
    @Param('id', ParseUUIDPipe) propietarioId: string,
    @Param('substitutoId', ParseUUIDPipe) substitutoId: string,
  ) {
    return this.minutesService.removeSubstitutoFromPropietario(
      propietarioId,
      substitutoId,
    );
  }
}