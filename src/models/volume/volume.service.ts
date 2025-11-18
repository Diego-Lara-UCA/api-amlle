import {
    Injectable,
    NotFoundException,
    Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VolumeEntity } from './entities/volume.entity';
import { CreateVolumeDto } from './dto/create-volume.dto';
import { UpdateVolumeDto } from './dto/update-volume.dto';
import { UserService } from 'src/models/user/user.service';
import { handleDatabaseError } from 'src/common/utils/error-handler.util';
import { VolumeState } from './enums/volume-status.enum';
import { BookService } from '../book/book.service';
import { VolumeModification } from './entities/volume-modification.entity';
import { GetVolumeResponseDto } from './dto/get-volume-response.dto';
import { GetVolumeManagementDto } from './dto/get-volume-management.dto';
import { log } from 'console';

@Injectable()
export class VolumeService {
    private readonly logger = new Logger('VolumesService');

    constructor(
        @InjectRepository(VolumeEntity)
        private readonly volumeRepository: Repository<VolumeEntity>,
        @InjectRepository(VolumeModification)
        private readonly modificationRepository: Repository<VolumeModification>,
        private readonly userService: UserService,
        private readonly booksService: BookService,
    ) { }

    create = async (
        createVolumeDto: CreateVolumeDto,
        userId: string,
    ): Promise<VolumeEntity> => {
        try {
            const { bookId, ...volumeData } = createVolumeDto;
            
            const user = await this.userService.findOneById(userId);
            const book = await this.booksService.findOneById(bookId);
            
            const newVolume = this.volumeRepository.create({
                ...volumeData,
                book: book,
                createdBy: user,
            });

            return await this.volumeRepository.save(newVolume);
        } catch (error) {
            throw handleDatabaseError(error, this.logger);
        }
    };

    findAll = async (): Promise<GetVolumeResponseDto[]> => {
        try {
            const volumes = await this.volumeRepository.find({
                relations: [
                    'book',
                    'minutes',
                    'minutes.agreements',
                    'createdBy',
                    'modifications',
                    'modifications.modifier',
                ],
                order: {
                    book: { name: 'ASC' },
                    number: 'ASC',
                },
            });

            return volumes.map(volume => GetVolumeResponseDto.fromEntity(volume));

        } catch (error) {
            throw handleDatabaseError(error, this.logger);
        }
    };

    findAllByBook = async (bookId: string): Promise<GetVolumeResponseDto[]> => {
        try {
            const volumes = await this.volumeRepository.find({
                where: { book: { id: bookId } },
                relations: [
                    'book',
                    'minutes',
                    'minutes.agreements',
                    'createdBy',
                    'modifications',
                    'modifications.modifier',
                ],
                order: { number: 'ASC' },
            });

            return volumes.map(volume => GetVolumeResponseDto.fromEntity(volume));

        } catch (error) {
            throw handleDatabaseError(error, this.logger);
        }
    };

    findOneById = async (id: string): Promise<VolumeEntity> => {
        let volume: VolumeEntity | null;
        try {
            volume = await this.volumeRepository.findOne({
                where: { id },
                relations: ['book', 'createdBy', 'minutes', 'modifications', 'modifications.modifier'],
            });
        } catch (error) {
            throw handleDatabaseError(error, this.logger);
        }

        if (!volume) {
            throw new NotFoundException(`Volumen con ID "${id}" no encontrado.`);
        }
        return volume;
    };

    update = async (
        id: string,
        updateDto: UpdateVolumeDto,
        userId: string,
    ): Promise<VolumeEntity> => {
        try {
            const modifier = await this.userService.findOneById(userId);
            const volume = await this.volumeRepository.preload({
                id,
                ...updateDto,
            });

            if (!volume) {
                throw new NotFoundException(`Volumen con ID "${id}" no encontrado.`);
            }

            const savedVolume = await this.volumeRepository.save(volume);
            const newModification = this.modificationRepository.create({
                volume: savedVolume,
                modifier: modifier,
            });
            await this.modificationRepository.save(newModification);

            return savedVolume;
        } catch (error) {
            throw handleDatabaseError(error, this.logger);
        }
    };
    updateStatus = async (
        id: string,
        status: VolumeState,
        userId: string,
    ): Promise<VolumeEntity> => {
        try {
            const [modifier, volume] = await Promise.all([
                this.userService.findOneById(userId),
                this.findOneById(id),
            ]);

            volume.status = status;

            const savedVolume = await this.volumeRepository.save(volume);
            const newModification = this.modificationRepository.create({
                volume: savedVolume,
                modifier: modifier,
            });

            await this.modificationRepository.save(newModification);
            return savedVolume;
        } catch (error) {
            throw handleDatabaseError(error, this.logger);
        }
    };

    remove = async (id: string): Promise<void> => {
        try {
            const result = await this.volumeRepository.delete(id);
            if (result.affected === 0) {
                throw new NotFoundException(`Volumen con ID "${id}" no encontrado.`);
            }
        } catch (error) {
            throw handleDatabaseError(error, this.logger);
        }
    };

    countAllVolumes = async (): Promise<number> => {
        try {
            return await this.volumeRepository.count();
        } catch (error) {
            throw handleDatabaseError(error, this.logger);
        }
    };

    findAllForManagement = async (): Promise<GetVolumeManagementDto[]> => {
        try {
            const query = this.volumeRepository.createQueryBuilder('volume');

            query.select([
                'volume.id AS id',
                'volume.name AS name',
                'volume.pageCount AS pageCount',
                'volume.number AS number',
                'volume.status AS status',
                'volume.createdAt AS createdAt',
                'createdBy.nombre AS createdByName',
                'book.id AS bookId',
                'book.name AS bookName',
            ]);

            query.addSelect('COUNT(DISTINCT minutes.id)', 'minutesCount');
            query.addSelect('COUNT(DISTINCT agreements.id)', 'agreementCount');

            query.addSelect(
                (subQuery) => {
                    return subQuery
                        .select('MAX(mod.modification_date)')
                        .from('volume_modifications', 'mod') //
                        .where('mod.volume_id = volume.id');
                },
                'latestModificationDate',
            );

            query.addSelect(
                (subQuery) => {
                    return subQuery
                        .select('user.nombre')
                        .from('volume_modifications', 'mod')
                        .leftJoin('usuarios', 'user', 'user.id = mod.user_id') //
                        .where('mod.volume_id = volume.id')
                        .orderBy('mod.modification_date', 'DESC')
                        .limit(1);
                },
                'latestModifierName',
            );

            query
                .leftJoin('volume.createdBy', 'createdBy')
                .leftJoin('volume.minutes', 'minutes')
                .leftJoin('minutes.agreements', 'agreements')
                .leftJoin('volume.book', 'book');

            query.groupBy(
                'volume.id, volume.name, volume.pageCount, volume.number, volume.status, volume.createdAt, createdBy.nombre, book.id, book.name'
            );

            query.orderBy('volume.createdAt', 'DESC');

            const results = await query.getRawMany();

            return results.map(r => ({
                ...r,
                minutesCount: parseInt(r.minutesCount, 10) || 0,
                agreementCount: parseInt(r.agreementCount, 10) || 0,
            }));

        } catch (error) {
            throw handleDatabaseError(error, this.logger);
        }
    };
}
