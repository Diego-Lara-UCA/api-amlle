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
import { AgreementService } from './agreement.service';
import { CreateAgreementDto } from './dto/create-agreement.dto';
import { UpdateAgreementDto } from './dto/update-agreement.dto';
import { Roles } from 'src/common/utils/decorators/roles.decorator';
import { Role } from 'src/models/user/enums/role.enum';
import { User } from 'src/common/utils/decorators/user.decorator';

@Controller('agreements')
export class AgreementController {
  constructor(private readonly agreementsService: AgreementService) {}

  @Post("create")
  @Roles(Role.ADMIN)
  create(
    @Body() createDto: CreateAgreementDto,
    @User('userId') userId: string,
  ) {
    return this.agreementsService.create(createDto, userId);
  }

  @Get('get-by-minutes/:minutesId')
  findAllByMinutes(@Param('minutesId', ParseUUIDPipe) minutesId: string) {
    return this.agreementsService.findAllByMinutes(minutesId);
  }

  @Get('get/:id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.agreementsService.findOne(id);
  }

  @Patch('update/:id')
  @Roles(Role.ADMIN)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateAgreementDto,
    @User('userId') userId: string,
  ) {
    return this.agreementsService.update(id, updateDto, userId);
  }

  @Delete('delete/:id')
  @Roles(Role.ADMIN) // O SUPERADMIN, según tu lógica
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.agreementsService.remove(id);
  }
}
