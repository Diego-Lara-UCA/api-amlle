import {
  Injectable,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { AgreementEntity } from './entities/agreement.entity';
import { CreateAgreementDto } from './dto/create-agreement.dto';
import { UpdateAgreementDto } from './dto/update-agreement.dto';
import { UserService } from 'src/models/user/user.service';
import { handleDatabaseError } from 'src/common/utils/error-handler.util';
import { UserEntity } from 'src/models/user/entities/user.entity';
import { MinutesService } from '../minutes/minute.service';
import { AgreementModification } from './entities/agreement-modification.entity';
import { UpdateAgreementNameNumberDto } from './dto/update-agreement-name-number.dto';

@Injectable()
export class AgreementService {
  private readonly logger = new Logger('AgreementsService');

  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(AgreementEntity)
    private readonly agreementRepository: Repository<AgreementEntity>,
    @InjectRepository(AgreementModification)
    private readonly modificationRepository: Repository<AgreementModification>,
    private readonly userService: UserService,
    private readonly minutesService: MinutesService,
  ) { }

  create = async (
    createDto: CreateAgreementDto,
    userId: string,
  ): Promise<AgreementEntity> => {
    try {
      const { minutesId, content, name, agreementNumber } = createDto;
      const [user, minutes] = await Promise.all([
        this.userService.findOneById(userId),
        this.minutesService.findOneMinutes(minutesId),
      ]);

      const newAgreement = this.agreementRepository.create({
        content,
        minutes: minutes,
        createdBy: user,
        name: name,
        agreementNumber: agreementNumber
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
        relations: ['createdBy', 'modifications'],
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
        relations: ['minutes', 'createdBy', 'modifications'],
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

      const savedAgreement = await this.agreementRepository.save(agreement);
      const newModification = this.modificationRepository.create({
        agreement: savedAgreement,
        modifier: modifier,
      });
      await this.modificationRepository.save(newModification);

      return savedAgreement;
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

  updateNameAndNumber = async (
    id: string,
    dto: UpdateAgreementNameNumberDto,
    userId: string,
  ): Promise<AgreementEntity> => {
    try {
      const updatedTargetAgreement = await this.dataSource.transaction(async (manager) => {
        const agreementRepo = manager.getRepository(AgreementEntity);
        const modificationRepo = manager.getRepository(AgreementModification);
        const [modifier, targetAgreement] = await Promise.all([
          this.userService.findOneById(userId),
          agreementRepo.findOne({ where: { id }, relations: ['minutes'] }),
        ]);

        if (!targetAgreement) {
          throw new NotFoundException(`Acuerdo (Agreement) con ID "${id}" no encontrado.`);
        }
        if (!targetAgreement.minutes) {
          throw new NotFoundException(`El acuerdo con ID "${id}" no está asociado a ningún acta.`);
        }

        const originalName = targetAgreement.name;
        const originalAgreementNumber = targetAgreement.agreementNumber;
        const existingAgreement = await agreementRepo.findOne({
          where: {
            name: dto.name,
            agreementNumber: dto.agreementNumber,
            minutes: { id: targetAgreement.minutes.id },
          },
        });

        targetAgreement.name = dto.name;
        targetAgreement.agreementNumber = dto.agreementNumber;

        const modificationsToSave: AgreementModification[] = [];

        if (existingAgreement) {
          existingAgreement.name = originalName;
          existingAgreement.agreementNumber = originalAgreementNumber;

          await agreementRepo.save([targetAgreement, existingAgreement]);

          modificationsToSave.push(
            modificationRepo.create({ agreement: targetAgreement, modifier: modifier }),
            modificationRepo.create({ agreement: existingAgreement, modifier: modifier })
          );

        } else {
          await agreementRepo.save(targetAgreement);
          modificationsToSave.push(
            modificationRepo.create({ agreement: targetAgreement, modifier: modifier })
          );
        }
        await modificationRepo.save(modificationsToSave);
        return targetAgreement;
      });
      return this.findOne(updatedTargetAgreement.id);

    } catch (error) {
      throw handleDatabaseError(error, this.logger);
    }
  };
}
