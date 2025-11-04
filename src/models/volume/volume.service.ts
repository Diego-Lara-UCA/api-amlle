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
import { VolumeState } from './types/enums/volume-status.enum';
import { BookService } from '../book/book.service';

@Injectable()
export class VolumeService {
    private readonly logger = new Logger('VolumesService');

    constructor(
        @InjectRepository(VolumeEntity)
        private readonly volumeRepository: Repository<VolumeEntity>,
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

    findAllByBook = async (bookId: string): Promise<VolumeEntity[]> => {
        try {
            return await this.volumeRepository.find({
                where: { book: { id: bookId } },
                relations: ['createdBy', 'modifiedBy'],
                order: { number: 'ASC' },
            });
        } catch (error) {
            throw handleDatabaseError(error, this.logger);
        }
    };


    findOneById = async (id: string): Promise<VolumeEntity> => {
        try {
            const volume = await this.volumeRepository.findOne({
                where: { id },
                relations: ['book', 'createdBy', 'modifiedBy', 'minutes'],
            });

            if (!volume) {
                throw new NotFoundException(`Volumen con ID "${id}" no encontrado.`);
            }

            return volume;
        } catch (error) {
            throw handleDatabaseError(error, this.logger);
        }
    };

    update = async (
        id: string,
        updateVolumeDto: UpdateVolumeDto,
        userId: string,
    ): Promise<VolumeEntity> => {
        try {
            const modifier = await this.userService.findOneById(userId);
            const volume = await this.volumeRepository.preload({
                id,
                ...updateVolumeDto,
            });

            if (!volume) {
                throw new NotFoundException(`Volumen con ID "${id}" no encontrado.`);
            }

            volume.modifiedBy = modifier;
            return await this.volumeRepository.save(volume);
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
            const modifier = await this.userService.findOneById(userId);
            const volume = await this.findOneById(id);

            volume.status = status;
            volume.modifiedBy = modifier;

            return await this.volumeRepository.save(volume);
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
}
