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
import { UpdateAgreementNameNumberDto } from './dto/update-agreement-name-number.dto';

@Controller('api/agreements')
export class AgreementController {
  constructor(private readonly agreementsService: AgreementService) {}

  @Post("create")
  @Roles(Role.SUPERADMIN, Role.ADMIN, Role.REGULAR)
  create(
    @Body() createDto: CreateAgreementDto,
    @User('userId') userId: string,
  ) {
    return this.agreementsService.create(createDto, userId);
  }

  @Get('get-by-minutes/:minutesId')
  @Roles(Role.SUPERADMIN, Role.ADMIN, Role.REGULAR)
  findAllByMinutes(@Param('minutesId', ParseUUIDPipe) minutesId: string) {
    return this.agreementsService.findAllByMinutes(minutesId);
  }

  @Get('get/:id')
  @Roles(Role.SUPERADMIN, Role.ADMIN, Role.REGULAR)
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.agreementsService.findOne(id);
  }

  @Patch('update/:id')
  @Roles(Role.SUPERADMIN, Role.ADMIN, Role.REGULAR)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateAgreementDto,
    @User('userId') userId: string,
  ) {
    return this.agreementsService.update(id, updateDto, userId);
  }

  @Delete('delete/:id')
  @Roles(Role.SUPERADMIN, Role.ADMIN, Role.REGULAR)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.agreementsService.remove(id);
  }

  @Patch('update-name-number/:id')
  @Roles(Role.SUPERADMIN, Role.ADMIN, Role.REGULAR)
  updateNameAndNumber(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateAgreementNameNumberDto,
    @User('userId') userId: string,
  ) {
    return this.agreementsService.updateNameAndNumber(id, dto, userId);
  }

  @Get('get-all')
  @Roles(Role.SUPERADMIN, Role.ADMIN, Role.REGULAR)
  findAll() {
    return this.agreementsService.findAll();
  }
}
