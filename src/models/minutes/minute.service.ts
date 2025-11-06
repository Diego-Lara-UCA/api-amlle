import {
  Injectable,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm'; // Importar 'In'
import { MinutesEntity } from './entities/minute.entity';
import { ParticipantsEntity } from './entities/participants.entity';
import { UserService } from 'src/models/user/user.service';
import { handleDatabaseError } from 'src/common/utils/error-handler.util';
import { CreateMinutesDto } from './dto/create-minutes.dto';
import { UpdateMinutesDto } from './dto/update-minutes.dto';
import { MinutesState } from './enums/minutes-status.enum';
import { CreateParticipantDto } from './dto/create-participant.dto';
import { UpdateParticipantDto } from './dto/update-participant.dto';
import { VolumeService } from '../volume/volume.service';
import { MinutesModification } from './entities/minutes-modification.entity';

@Injectable()
export class MinutesService {
  private readonly logger = new Logger('MinutesService');

  constructor(
    @InjectRepository(MinutesEntity)
    private readonly minutesRepository: Repository<MinutesEntity>,
    @InjectRepository(ParticipantsEntity)
    private readonly participantRepository: Repository<ParticipantsEntity>,
    @InjectRepository(MinutesModification)
    private readonly modificationRepository: Repository<MinutesModification>,
    private readonly userService: UserService,
    private readonly volumesService: VolumeService,
  ) { }

  createMinutes = async (
    createDto: CreateMinutesDto,
    userId: string,
  ): Promise<MinutesEntity> => {
    try {
      const { volumeId, participantIds, ...minutesData } = createDto;

      const [user, volume] = await Promise.all([
        this.userService.findOneById(userId),
        this.volumesService.findOneById(volumeId),
      ]);

      let participants: ParticipantsEntity[] = [];
      if (participantIds && participantIds.length > 0) {
        participants = await this.findParticipantsByIds(participantIds);
        if (participants.length !== participantIds.length) {
          throw new NotFoundException('Uno o más participantes no fueron encontrados.');
        }
      }

      const newMinutes = this.minutesRepository.create({
        ...minutesData,
        volume: volume,
        createdBy: user,
        participants: participants,
      });

      return await this.minutesRepository.save(newMinutes);
    } catch (error) {
      throw handleDatabaseError(error, this.logger);
    }
  };

  findAllMinutesByVolume = async (volumeId: string): Promise<MinutesEntity[]> => {
    try {
      return await this.minutesRepository.find({
        where: { volume: { id: volumeId } },
        relations: ['createdBy', 'modifications'],
        order: { createdAt: 'ASC' },
      });
    } catch (error) {
      throw handleDatabaseError(error, this.logger);
    }
  };

  findOneMinutes = async (id: string): Promise<MinutesEntity> => {
    try {
      const minutes = await this.minutesRepository.findOne({
        where: { id },
        relations: [
          'volume', 'createdBy', 'modifications', 'participants', 'agreements',
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
      const modifier = await this.userService.findOneById(userId);
      const minutes = await this.minutesRepository.preload({
        id,
        ...updateDto,
      });

      if (!minutes) {
        throw new NotFoundException(`Acta (Minutes) con ID "${id}" no encontrada.`);
      }

      const savedMinutes = await this.minutesRepository.save(minutes);
      const newModification = this.modificationRepository.create({
        minutes: savedMinutes,
        modifier: modifier,
      });
      await this.modificationRepository.save(newModification);

      return savedMinutes;
    } catch (error) {
      throw handleDatabaseError(error, this.logger);
    }
  };

  updateMinutesStatus = async (
    id: string,
    status: MinutesState,
    userId: string,
  ): Promise<MinutesEntity> => {
    try {
      const [modifier, minutes] = await Promise.all([
        this.userService.findOneById(userId),
        this.findOneMinutes(id),
      ]);

      minutes.status = status;

      const savedMinutes = await this.minutesRepository.save(minutes);
      const newModification = this.modificationRepository.create({
        minutes: savedMinutes,
        modifier: modifier,
      });
      
      await this.modificationRepository.save(newModification);

      return savedMinutes;
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

  createParticipant = async (dto: CreateParticipantDto): Promise<ParticipantsEntity> => {
    try {
      const newParticipant = this.participantRepository.create(dto);
      return await this.participantRepository.save(newParticipant);
    } catch (error) {
      throw handleDatabaseError(error, this.logger);
    }
  };

  findAllParticipants = async (): Promise<ParticipantsEntity[]> => {
    try {
      return await this.participantRepository.find();
    } catch (error) {
      throw handleDatabaseError(error, this.logger);
    }
  };

  findOneParticipant = async (id: string): Promise<ParticipantsEntity> => {
    try {
      const participant = await this.participantRepository.findOneBy({ id });
      if (!participant) {
        throw new NotFoundException(`Participante con ID "${id}" no encontrado.`);
      }
      return participant;
    } catch (error) {
      throw handleDatabaseError(error, this.logger);
    }
  };

  findParticipantsByIds = async (ids: string[]): Promise<ParticipantsEntity[]> => {
    if (ids.length === 0) return [];
    try {
      return await this.participantRepository.findBy({ id: In(ids) });
    } catch (error) {
      throw handleDatabaseError(error, this.logger);
    }
  };

  updateParticipant = async (
    id: string,
    dto: UpdateParticipantDto,
  ): Promise<ParticipantsEntity> => {
    try {
      const participant = await this.participantRepository.preload({ id, ...dto });
      if (!participant) {
        throw new NotFoundException(`Participante con ID "${id}" no encontrado.`);
      }
      return await this.participantRepository.save(participant);
    } catch (error) {
      throw handleDatabaseError(error, this.logger);
    }
  };

  removeParticipant = async (id: string): Promise<void> => {
    try {
      const result = await this.participantRepository.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException(`Participante con ID "${id}" no encontrado.`);
      }
    } catch (error) {
      throw handleDatabaseError(error, this.logger);
    }
  };
}