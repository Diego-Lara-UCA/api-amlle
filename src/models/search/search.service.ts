import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, FindOptionsWhere, ILike, Repository } from 'typeorm';
import { BookEntity } from '../book/entities/book.entity';
import { VolumeEntity } from '../volume/entities/volume.entity';
import { MinutesEntity } from '../minutes/entities/minute.entity';
import { AgreementEntity } from '../agreement/entities/agreement.entity';
import { SearchResponseDto } from './dto/search-response.dto';
import { handleDatabaseError } from 'src/common/utils/error-handler.util';
import { GetBookResponseDto } from '../book/dto/get-book-response.dto';
import { GetVolumeResponseDto } from '../volume/dto/get-volume-response.dto';
import { GetMinutesResponseDto } from '../minutes/dto/get-minutes-response.dto';
import { GetAgreementResponseDto } from '../agreement/dto/get-agreement-response.dto';
import { SearchableEntityType, SearchQueryDto } from './dto/search-query.dto';

@Injectable()
export class SearchService {
  private readonly logger = new Logger('SearchService');

  constructor(
    @InjectRepository(BookEntity)
    private readonly bookRepository: Repository<BookEntity>,
    @InjectRepository(VolumeEntity)
    private readonly volumeRepository: Repository<VolumeEntity>,
    @InjectRepository(MinutesEntity)
    private readonly minutesRepository: Repository<MinutesEntity>,
    @InjectRepository(AgreementEntity)
    private readonly agreementRepository: Repository<AgreementEntity>,
  ) { }


  search = async (query: SearchQueryDto): Promise<SearchResponseDto> => {
    try {
      const keywordQuery = query.keyword ? `%${query.keyword}%` : null;
      const whereBooks: FindOptionsWhere<BookEntity> = {};
      if (keywordQuery) whereBooks.name = ILike(keywordQuery);
      if (query.bookStatus) whereBooks.status = query.bookStatus;
      if (query.dateFrom && query.dateTo) {
        whereBooks.createdAt = Between(new Date(query.dateFrom), new Date(query.dateTo));
      }

      const whereVolumes: FindOptionsWhere<VolumeEntity> = {};
      if (keywordQuery) whereVolumes.name = ILike(keywordQuery);
      if (query.volumeStatus) whereVolumes.status = query.volumeStatus;

      let whereMinutes: FindOptionsWhere<MinutesEntity>[] | FindOptionsWhere<MinutesEntity> = {};
      if (keywordQuery) {
        const baseWhere: FindOptionsWhere<MinutesEntity> = {};
        if (query.minutesStatus) baseWhere.status = query.minutesStatus;
        if (query.dateFrom && query.dateTo) {
          baseWhere.meetingDate = Between(new Date(query.dateFrom), new Date(query.dateTo));
        }

        whereMinutes = [
          { ...baseWhere, name: ILike(keywordQuery) },
          { ...baseWhere, bodyContent: ILike(keywordQuery) },
        ];
      } else {
        if (query.minutesStatus) whereMinutes.status = query.minutesStatus;
        if (query.dateFrom && query.dateTo) {
          whereMinutes.meetingDate = Between(new Date(query.dateFrom), new Date(query.dateTo));
        }
      }

      let whereAgreements: FindOptionsWhere<AgreementEntity>[] | FindOptionsWhere<AgreementEntity> = {};
      if (keywordQuery) {
        whereAgreements = [
          { name: ILike(keywordQuery) },
          { content: ILike(keywordQuery) },
        ];
      }

      const books = (!query.entityType || query.entityType === SearchableEntityType.BOOKS)
        ? await this.bookRepository.find({
          where: whereBooks,
          relations: [
            'createdBy',
            'modifications',
            'modifications.modifier',
            'volumes',
            'volumes.minutes',
            'volumes.minutes.agreements',
          ],
        })
        : [];

      const volumes = (!query.entityType || query.entityType === SearchableEntityType.VOLUMES)
        ? await this.volumeRepository.find({
          where: whereVolumes,
          relations: [
            'book',
            'minutes',
            'minutes.agreements',
            'createdBy',
            'modifications',
            'modifications.modifier',
          ],
        })
        : [];

      const minutes = (!query.entityType || query.entityType === SearchableEntityType.MINUTES)
        ? await this.minutesRepository.find({
          where: whereMinutes,
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
        })
        : [];

      const agreements = (!query.entityType || query.entityType === SearchableEntityType.AGREEMENTS)
        ? await this.agreementRepository.find({
          where: whereAgreements,
          relations: [
            'createdBy',
            'modifications',
            'modifications.modifier',
            'minutes',
            'minutes.volume',
            'minutes.volume.book',
          ],
        })
        : [];

      return {
        books: books.map(book => GetBookResponseDto.fromEntity(book)),
        volumes: volumes.map(volume => GetVolumeResponseDto.fromEntity(volume)),
        minutes: minutes.map(minute => GetMinutesResponseDto.fromEntity(minute)),
        agreements: agreements.map(agreement => GetAgreementResponseDto.fromEntity(agreement)),
      };

    } catch (error) {
      throw handleDatabaseError(error, this.logger);
    }
  };
}