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
import { UpdateMinutesStatusDto } from './dto/update-minutes-status.dto';
import { CreateParticipantDto } from './dto/create-participant.dto';
import { UpdateParticipantDto } from './dto/update-participant.dto';
import { Roles } from 'src/common/utils/decorators/roles.decorator';
import { Role } from 'src/models/user/enums/role.enum';
import { User } from 'src/common/utils/decorators/user.decorator';
import { MinutesService } from './minute.service';

@Controller('api/')
export class MinuteController {
  constructor(private readonly minutesService: MinutesService) {}

  @Post('minutes/create')
  @Roles(Role.ADMIN)
  createMinutes(
    @Body() createDto: CreateMinutesDto,
    @User('userId') userId: string,
  ) {
    return this.minutesService.createMinutes(createDto, userId);
  }

  @Get('minutes/find-all-by-volume/:volumeId')
  findAllMinutesByVolume(@Param('volumeId', ParseUUIDPipe) volumeId: string) {
    return this.minutesService.findAllMinutesByVolume(volumeId);
  }

  @Get('minutes/find/:id')
  findOneMinutes(@Param('id', ParseUUIDPipe) id: string) {
    return this.minutesService.findOneMinutes(id);
  }

  @Patch('minutes/update/:id')
  @Roles(Role.ADMIN)
  updateMinutes(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateMinutesDto,
    @User('userId') userId: string,
  ) {
    return this.minutesService.updateMinutes(id, updateDto, userId);
  }

  @Patch('minutes/update-status/:id/status')
  @Roles(Role.ADMIN)
  updateMinutesStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateStatusDto: UpdateMinutesStatusDto,
    @User('userId') userId: string,
  ) {
    return this.minutesService.updateMinutesStatus(id, updateStatusDto.status, userId);
  }

  @Delete('minutes/delete/:id')
  @Roles(Role.SUPERADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  removeMinutes(@Param('id', ParseUUIDPipe) id: string) {
    return this.minutesService.removeMinutes(id);
  }

  @Post('participants/crate')
  @Roles(Role.SUPERADMIN)
  createParticipant(@Body() dto: CreateParticipantDto) {
    return this.minutesService.createParticipant(dto);
  }

  @Get('participants/find-all')
  findAllParticipants() {
    return this.minutesService.findAllParticipants();
  }

  @Get('participants/find/:id')
  findOneParticipant(@Param('id', ParseUUIDPipe) id: string) {
    return this.minutesService.findOneParticipant(id);
  }

  @Patch('participants/update/:id')
  @Roles(Role.SUPERADMIN)
  updateParticipant(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateParticipantDto,
  ) {
    return this.minutesService.updateParticipant(id, dto);
  }

  @Delete('participants/delete/:id')
  @Roles(Role.SUPERADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  removeParticipant(@Param('id', ParseUUIDPipe) id: string) {
    return this.minutesService.removeParticipant(id);
  }
}