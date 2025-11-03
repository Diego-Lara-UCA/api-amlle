import {
  Injectable,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AgreementEntity } from './entities/agreement.entity';
import { CreateAgreementDto } from './dto/create-agreement.dto';
import { UpdateAgreementDto } from './dto/update-agreement.dto';
import { UserService } from 'src/models/user/user.service';
import { handleDatabaseError } from 'src/common/utils/error-handler.util';
import { UserEntity } from 'src/models/user/entities/user.entity';
import { MinutesService } from '../minutes/minute.service';

@Injectable()
export class AgreementService {
  private readonly logger = new Logger('AgreementsService');

  constructor(
    @InjectRepository(AgreementEntity)
    private readonly agreementRepository: Repository<AgreementEntity>,
    private readonly userService: UserService,
    private readonly minutesService: MinutesService,
  ) {}

  create = async (
    createDto: CreateAgreementDto,
    userId: string,
  ): Promise<AgreementEntity> => {
    try {
      const { minutesId, content } = createDto;
      const [user, minutes] = await Promise.all([
        this.userService.findOneById(userId),
        this.minutesService.findOneMinutes(minutesId),
      ]);

      const newAgreement = this.agreementRepository.create({
        content,
        minutes: minutes,
        createdBy: user,
      });

      return await this.agreementRepository.save(newAgreement);
    } catch (error) {
      throw handleDatabaseError(error, this.logger);
    }
  };

  findAllByMinutes = async (minutesId: string): Promise<AgreementEntity[]> => {
    try {
      return await this.agreementRepository.find({
        where: { minutes: { id: minutesId } },
        relations: ['createdBy', 'modifiedBy'],
        order: { createdAt: 'ASC' },
      });
    } catch (error) {
      throw handleDatabaseError(error, this.logger);
    }
  };

  findOne = async (id: string): Promise<AgreementEntity> => {
    try {
      const agreement = await this.agreementRepository.findOne({
        where: { id },
        relations: ['minutes', 'createdBy', 'modifiedBy'],
      });

      if (!agreement) {
        throw new NotFoundException(`Acuerdo (Agreement) con ID "${id}" no encontrado.`);
      }
      return agreement;
    } catch (error) {
      throw handleDatabaseError(error, this.logger);
    }
  };

  update = async (
    id: string,
    updateDto: UpdateAgreementDto,
    userId: string,
  ): Promise<AgreementEntity> => {
    try {
      const modifier = await this.userService.findOneById(userId);

      const agreement = await this.agreementRepository.preload({
        id,
        ...updateDto,
      });

      if (!agreement) {
        throw new NotFoundException(`Acuerdo (Agreement) con ID "${id}" no encontrado.`);
      }

      agreement.modifiedBy = modifier;
      return await this.agreementRepository.save(agreement);
    } catch (error) {
      throw handleDatabaseError(error, this.logger);
    }
  };

  remove = async (id: string): Promise<void> => {
    try {
      const result = await this.agreementRepository.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException(`Acuerdo (Agreement) con ID "${id}" no encontrado.`);
      }
    } catch (error) {
      throw handleDatabaseError(error, this.logger);
    }
  };
}
