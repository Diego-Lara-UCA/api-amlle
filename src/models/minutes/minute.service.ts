import {
  Injectable,
  NotFoundException,
  Logger,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, DataSource } from 'typeorm'; // Importar 'In'
import { MinutesEntity } from './entities/minute.entity';
import { UserService } from 'src/models/user/user.service';
import { handleDatabaseError } from 'src/common/utils/error-handler.util';
import { CreateMinutesDto } from './dto/create-minutes.dto';
import { UpdateMinutesDto } from './dto/update-minutes.dto';
import { VolumeService } from '../volume/volume.service';
import { MinutesModification } from './entities/minutes-modification.entity';
import { PropietarioEntity } from './entities/propietario.entity';
import { SubstitutoEntity } from './entities/substituto.entity';
import { CreatePropietarioDto } from './dto/create-propietario.dto';
import { UpdatePropietarioDto } from './dto/update-propietario.dto';
import { CreateSubstitutoDto } from './dto/create-substituto.dto';
import { UpdateSubstitutoDto } from './dto/update-substituto.dto';
import { AttendanceEntity } from './entities/attendance.entity';
import { UpdateMinutesNameNumberDto } from './dto/update-minutes-name-number.dto';
import { GetMinutesResponseDto } from './dto/get-minutes-response.dto';

@Injectable()
export class MinutesService {
  private readonly logger = new Logger('MinutesService');

  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(MinutesEntity)
    private readonly minutesRepository: Repository<MinutesEntity>,
    @InjectRepository(MinutesModification)
    private readonly modificationRepository: Repository<MinutesModification>,
    @InjectRepository(PropietarioEntity)
    private readonly propietarioRepository: Repository<PropietarioEntity>,
    @InjectRepository(SubstitutoEntity)
    private readonly substitutoRepository: Repository<SubstitutoEntity>,
    @InjectRepository(AttendanceEntity)
    private readonly attendanceRepository: Repository<AttendanceEntity>,
    private readonly userService: UserService,
    private readonly volumesService: VolumeService,
  ) { }

  createMinutes = async (
    createDto: CreateMinutesDto,
    userId: string,
  ): Promise<MinutesEntity> => {
    try {
      const { volumeId, ...minutesData } = createDto;
      const [user, volume] = await Promise.all([
        this.userService.findOneById(userId),
        this.volumesService.findOneById(volumeId),
      ]);
      const newMinutes = this.minutesRepository.create({
        ...minutesData,
        volume: volume,
        createdBy: user
      });
      return await this.minutesRepository.save(newMinutes);
    } catch (error) {
      throw handleDatabaseError(error, this.logger);
    }
  };

  findAllMinutes = async (): Promise<GetMinutesResponseDto[]> => {
    try {
      const minutesList = await this.minutesRepository.find({
        relations: [
          'volume',
          'volume.book',
          'createdBy',
          'agreements',
          'modifications',
          'modifications.modifier',
          'attendanceList',
          'attendanceList.propietarioConvocado',
          'attendanceList.substitutoAsistente',
        ],
        order: {
          createdAt: 'DESC',
        },
      });

      return minutesList.map(minutes => GetMinutesResponseDto.fromEntity(minutes));

    } catch (error) {
      throw handleDatabaseError(error, this.logger);
    }
  };

  findAllMinutesByVolume = async (volumeId: string): Promise<GetMinutesResponseDto[]> => {
    try {
      const minutesList = await this.minutesRepository.find({
        where: { volume: { id: volumeId } },
        relations: [
          'volume',
          'createdBy',
          'agreements',
          'modifications',
          'modifications.modifier',
          'attendanceList',
          'attendanceList.propietarioConvocado',
          'attendanceList.substitutoAsistente',
        ],
        order: {
          actNumber: 'ASC',
        },
      });

      return minutesList.map(minutes => GetMinutesResponseDto.fromEntity(minutes));

    } catch (error) {
      throw handleDatabaseError(error, this.logger);
    }
  };

  findOneMinutes = async (id: string): Promise<MinutesEntity> => {
    try {
      const minutes = await this.minutesRepository.findOne({
        where: { id },
        relations: [
          'volume',
          'createdBy',
          'modifications',
          'agreements',
          'attendanceList',
          'attendanceList.propietarioConvocado',
          'attendanceList.substitutoAsistente',
        ],
      });
      if (!minutes) {
        throw new NotFoundException(`Acta (Minutes) con ID "${id}" no encontrada.`);
      }
      return minutes;
    } catch (error) {
      throw handleDatabaseError(error, this.logger);
    }
  };

  updateMinutes = async (
    id: string,
    updateDto: UpdateMinutesDto,
    userId: string,
  ): Promise<MinutesEntity> => {
    try {
      const updatedMinutes = await this.dataSource.transaction(async (manager) => {
        const minutesRepo = manager.getRepository(MinutesEntity);
        const attendanceRepo = manager.getRepository(AttendanceEntity);
        const modificationRepo = manager.getRepository(MinutesModification);

        const modifier = await this.userService.findOneById(userId);
        const minutes = await minutesRepo.findOneBy({ id });

        if (!minutes) {
          throw new NotFoundException(`Acta (Minutes) con ID "${id}" no encontrada.`);
        }

        if (updateDto.attendanceList) {
          await attendanceRepo.delete({ minutes: { id: id } });
          const newAttendance = updateDto.attendanceList.map((item) =>
            attendanceRepo.create({
              minutes: minutes,
              syndic: item.syndic,
              secretary: item.secretary,
              propietarioConvocado: { id: item.propietarioConvocadoId },
              asistioPropietario: item.asistioPropietario,
              substitutoAsistente: item.substitutoAsistenteId
                ? { id: item.substitutoAsistenteId }
                : undefined,
            }),
          );
          await attendanceRepo.save(newAttendance);
        }
        const { attendanceList, ...updatableData } = updateDto;

        const updatedMinutesData = minutesRepo.create({
          ...minutes,
          ...updatableData,
        });
        const savedMinutes = await minutesRepo.save(updatedMinutesData);

        const newModification = modificationRepo.create({
          minutes: savedMinutes,
          modifier: modifier,
        });
        await modificationRepo.save(newModification);

        return savedMinutes;
      });

      return this.findOneMinutes(updatedMinutes.id);
    } catch (error) {
      throw handleDatabaseError(error, this.logger);
    }
  };

  updateNameAndNumber = async (
    id: string,
    dto: UpdateMinutesNameNumberDto,
    userId: string,
  ): Promise<MinutesEntity> => {
    try {
      const updatedTargetMinute = await this.dataSource.transaction(async (manager) => {
        const minutesRepo = manager.getRepository(MinutesEntity);
        const modificationRepo = manager.getRepository(MinutesModification);

        const [modifier, targetMinute] = await Promise.all([
          this.userService.findOneById(userId),
          minutesRepo.findOne({ where: { id }, relations: ['volume'] }),
        ]);

        if (!targetMinute) {
          throw new NotFoundException(`Acta (Minutes) con ID "${id}" no encontrada.`);
        }

        const originalName = targetMinute.name;
        const originalActNumber = targetMinute.actNumber;
        const existingMinute = await minutesRepo.findOne({
          where: {
            name: dto.name,
            actNumber: dto.actNumber,
            volume: { id: targetMinute.volume.id },
          },
        });

        targetMinute.name = dto.name;
        targetMinute.actNumber = dto.actNumber;

        const modificationsToSave: MinutesModification[] = [];

        if (existingMinute) {
          existingMinute.name = originalName;
          existingMinute.actNumber = originalActNumber;

          await minutesRepo.save([targetMinute, existingMinute]);

          modificationsToSave.push(
            modificationRepo.create({ minutes: targetMinute, modifier: modifier }),
            modificationRepo.create({ minutes: existingMinute, modifier: modifier })
          );

        } else {
          await minutesRepo.save(targetMinute);
          modificationsToSave.push(
            modificationRepo.create({ minutes: targetMinute, modifier: modifier })
          );
        }
        await modificationRepo.save(modificationsToSave);
        return targetMinute;
      });
      return this.findOneMinutes(updatedTargetMinute.id);
    } catch (error) {
      throw handleDatabaseError(error, this.logger);
    }
  };

  removeMinutes = async (id: string): Promise<void> => {
    try {
      const result = await this.minutesRepository.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException(`Acta (Minutes) con ID "${id}" no encontrada.`);
      }
    } catch (error) {
      throw handleDatabaseError(error, this.logger);
    }
  };


  createPropietario = async (dto: CreatePropietarioDto): Promise<PropietarioEntity> => {
    try {
      const newPropietario = this.propietarioRepository.create(dto);
      return await this.propietarioRepository.save(newPropietario);
    } catch (error) {
      throw handleDatabaseError(error, this.logger);
    }
  };

  findAllPropietarios = async (): Promise<PropietarioEntity[]> => {
    try {
      return await this.propietarioRepository.find({
        relations: ['approvedSubstitutes'],
      });
    } catch (error) {
      throw handleDatabaseError(error, this.logger);
    }
  };

  findOnePropietario = async (id: string): Promise<PropietarioEntity> => {
    try {
      const propietario = await this.propietarioRepository.findOne({
        where: { id },
        relations: ['approvedSubstitutes', 'attendanceRecords'],
      });
      if (!propietario) {
        throw new NotFoundException(`Propietario con ID "${id}" no encontrado.`);
      }
      return propietario;
    } catch (error) {
      throw handleDatabaseError(error, this.logger);
    }
  };

  updatePropietario = async (
    id: string,
    dto: UpdatePropietarioDto,
  ): Promise<PropietarioEntity> => {
    try {
      const propietario = await this.propietarioRepository.preload({ id, ...dto });
      if (!propietario) {
        throw new NotFoundException(`Propietario con ID "${id}" no encontrado.`);
      }
      return await this.propietarioRepository.save(propietario);
    } catch (error) {
      throw handleDatabaseError(error, this.logger);
    }
  };

  removePropietario = async (id: string): Promise<void> => {
    try {
      const result = await this.propietarioRepository.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException(`Propietario con ID "${id}" no encontrado.`);
      }
    } catch (error) {
      throw handleDatabaseError(error, this.logger);
    }
  };

  createSubstituto = async (dto: CreateSubstitutoDto): Promise<SubstitutoEntity> => {
    try {
      const newSubstituto = this.substitutoRepository.create(dto);
      return await this.substitutoRepository.save(newSubstituto);
    } catch (error) {
      throw handleDatabaseError(error, this.logger);
    }
  };

  findAllSubstitutos = async (): Promise<SubstitutoEntity[]> => {
    try {
      return await this.substitutoRepository.find({
        relations: ['canSubstituteFor'],
      });
    } catch (error) {
      throw handleDatabaseError(error, this.logger);
    }
  };

  findOneSubstituto = async (id: string): Promise<SubstitutoEntity> => {
    try {
      const substituto = await this.substitutoRepository.findOne({
        where: { id },
        relations: ['canSubstituteFor', 'attendedAsSubstitute'],
      });
      if (!substituto) {
        throw new NotFoundException(`Substituto con ID "${id}" no encontrado.`);
      }
      return substituto;
    } catch (error) {
      throw handleDatabaseError(error, this.logger);
    }
  };

  updateSubstituto = async (
    id: string,
    dto: UpdateSubstitutoDto,
  ): Promise<SubstitutoEntity> => {
    try {
      const substituto = await this.substitutoRepository.preload({ id, ...dto });
      if (!substituto) {
        throw new NotFoundException(`Substituto con ID "${id}" no encontrado.`);
      }
      return await this.substitutoRepository.save(substituto);
    } catch (error) {
      throw handleDatabaseError(error, this.logger);
    }
  };

  removeSubstituto = async (id: string): Promise<void> => {
    try {
      const result = await this.substitutoRepository.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException(`Substituto con ID "${id}" no encontrado.`);
      }
    } catch (error) {
      throw handleDatabaseError(error, this.logger);
    }
  };

  assignSubstituto = async (
    propietarioId: string,
    substitutoId: string,
  ): Promise<PropietarioEntity> => {
    try {
      const [propietario, substituto] = await Promise.all([
        this.findOnePropietario(propietarioId),
        this.findOneSubstituto(substitutoId),
      ]);
      const alreadyAssigned = propietario.approvedSubstitutes.some(
        (sub) => sub.id === substituto.id,
      );
      if (alreadyAssigned) {
        throw new ConflictException('Este substituto ya está asignado a este propietario.');
      }
      propietario.approvedSubstitutes.push(substituto);
      return await this.propietarioRepository.save(propietario);
    } catch (error) {
      throw handleDatabaseError(error, this.logger);
    }
  };

  removeSubstitutoFromPropietario = async (
    propietarioId: string,
    substitutoId: string,
  ): Promise<void> => {
    try {
      const propietario = await this.findOnePropietario(propietarioId);
      const initialCount = propietario.approvedSubstitutes.length;
      propietario.approvedSubstitutes = propietario.approvedSubstitutes.filter(
        (sub) => sub.id !== substitutoId,
      );
      if (initialCount === propietario.approvedSubstitutes.length) {
        throw new NotFoundException('El substituto no estaba asignado a este propietario.');
      }
      await this.propietarioRepository.save(propietario);
    } catch (error) {
      throw handleDatabaseError(error, this.logger);
    }
  };
}