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
import { CreateVolumeDto } from './dto/create-volume.dto';
import { UpdateVolumeDto } from './dto/update-volume.dto';
import { Roles } from 'src/common/utils/decorators/roles.decorator';
import { Role } from 'src/models/user/enums/role.enum';
import { User } from 'src/common/utils/decorators/user.decorator';
import { UpdateVolumeStatusDto } from './dto/update-volume-status.dto';
import { VolumeService } from './volume.service';

@Controller('api/volume')
export class VolumeController {
  constructor(private readonly volumesService: VolumeService) {}

  @Post("create")
  @Roles(Role.ADMIN)
  create(@Body() createVolumeDto: CreateVolumeDto, @User('userId') userId: string) {
    return this.volumesService.create(createVolumeDto, userId);
  }

  @Get('find-all-by-book/:bookId')
  findAllByBook(@Param('bookId', ParseUUIDPipe) bookId: string) {
    return this.volumesService.findAllByBook(bookId);
  }

  @Get('find/:id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.volumesService.findOneById(id);
  }

  @Patch('update/:id')
  @Roles(Role.ADMIN)
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateVolumeDto: UpdateVolumeDto, @User('userId') userId: string) {
    return this.volumesService.update(id, updateVolumeDto, userId);
  }

  @Patch('update-status/:id')
  @Roles(Role.ADMIN)
  updateStatus(@Param('id', ParseUUIDPipe) id: string, @Body() updateStatusDto: UpdateVolumeStatusDto, @User('userId') userId: string) {
    return this.volumesService.updateStatus(id, updateStatusDto.status, userId);
  }

  @Delete('delete/:id')
  @Roles(Role.SUPERADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.volumesService.remove(id);
  }
}
