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
import { GetAgreementResponseDto } from './dto/get-agreement-response.dto';
import { GetAgreementManagementDto } from './dto/get-agreement-management.dto';

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

  findAll = async (): Promise<GetAgreementResponseDto[]> => {
    try {
      const agreements = await this.agreementRepository.find({
        relations: [
          'createdBy',
          'modifications',
          'modifications.modifier',
          'minutes',
          'minutes.volume',
          'minutes.volume.book',
        ],
        order: {
          createdAt: 'DESC',
        },
      });

      return agreements.map(agreement => GetAgreementResponseDto.fromEntity(agreement));
    } catch (error) {
      throw handleDatabaseError(error, this.logger);
    }
  };

  findAllByMinutes = async (minutesId: string): Promise<GetAgreementResponseDto[]> => {
    try {
      const agreements = await this.agreementRepository.find({
        where: { minutes: { id: minutesId } },
        relations: [
          'createdBy',
          'modifications',
          'modifications.modifier',
          'minutes',
          'minutes.volume',
          'minutes.volume.book',
        ],
        order: { agreementNumber: 'ASC' },
      });

      return agreements.map(agreement => GetAgreementResponseDto.fromEntity(agreement));
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
        if (existingAgreement && existingAgreement.id !== targetAgreement.id) {

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

  countAllAgreements = async (): Promise<number> => {
    try {
      return await this.agreementRepository.count();
    } catch (error) {
      throw handleDatabaseError(error, this.logger); //
    }
  };

findAllForManagement = async (): Promise<GetAgreementManagementDto[]> => {
    try {
      const query = this.agreementRepository.createQueryBuilder('agreement');

      query.select([
        'agreement.id AS id',
        'agreement.name AS name',
        'agreement.agreementNumber AS agreementNumber',
        'agreement.createdAt AS createdAt',
        'createdBy.nombre AS createdByName',
        'minutes.id AS minutesId',
        'minutes.name AS minutesName',
        'volume.id AS volumeId',
        'volume.name AS volumeName',
        'book.id AS bookId',
        'book.name AS bookName',
      ]);

      query.addSelect(
        (subQuery) => {
          return subQuery
            .select('MAX(mod.modification_date)')
            .from('agreement_modifications', 'mod')
            .where('mod.agreement_id = agreement.id');
        },
        'latestModificationDate',
      );
      query.addSelect(
        (subQuery) => {
          return subQuery
            .select('user.nombre')
            .from('agreement_modifications', 'mod')
            .leftJoin('usuarios', 'user', 'user.id = mod.user_id')
            .where('mod.agreement_id = agreement.id')
            .orderBy('mod.modification_date', 'DESC')
            .limit(1);
        },
        'latestModifierName',
      );

      query
        .leftJoin('agreement.createdBy', 'createdBy')
        .leftJoin('agreement.minutes', 'minutes')
        .leftJoin('minutes.volume', 'volume')
        .leftJoin('volume.book', 'book');

      query.groupBy(
        'agreement.id, agreement.name, agreement.agreementNumber, agreement.content, agreement.createdAt, ' +
        'createdBy.nombre, ' +
        'minutes.id, minutes.name, ' +
        'volume.id, volume.name, ' +
        'book.id, book.name'
      );
      
      query.orderBy('agreement.createdAt', 'DESC');

      return await query.getRawMany();
    } catch (error) {
      throw handleDatabaseError(error, this.logger);
    }
  };
}
