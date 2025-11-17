import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BookEntity } from './entities/book.entity';
import { DataSource, Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { CreateBookDto } from './dto/create-book.dto';
import { handleDatabaseError } from 'src/common/utils/error-handler.util';
import { UpdateBookDto } from './dto/update-book.dto';
import { BookState } from './enums/book-state.enum';
import { BookModification } from './entities/book-modification.entity';
import { GetBookManagementDto } from './dto/get-book-management.dto';
import { GetBookAgreementsContentDto } from './dto/get-book-agreements-content.dto';

type AgreementContentRawResult = {
    content: string;
};

@Injectable()
export class BookService {
    private readonly logger = new Logger('BooksService');

    constructor(
        private readonly dataSource: DataSource,
        @InjectRepository(BookEntity)
        private readonly bookRepository: Repository<BookEntity>,
        @InjectRepository(BookModification)
        private readonly modificationRepository: Repository<BookModification>,
        private readonly userService: UserService
    ) { }

    create = async (
        createBookDto: CreateBookDto,
        userId: string,
    ): Promise<BookEntity> => {
        try {
            const user = await this.userService.findOneById(userId);
            const newBook = this.bookRepository.create({
                ...createBookDto,
                createdBy: user,
            });

            return await this.bookRepository.save(newBook);
        } catch (error) {
            throw handleDatabaseError(error, this.logger);
        }
    };

    findAll = async (): Promise<BookEntity[]> => {
        try {
            return await this.bookRepository.find({
                relations: ['createdBy', 'modifications'],
            });
        } catch (error) {
            throw handleDatabaseError(error, this.logger);
        }
    };

    findOneById = async (id: string): Promise<BookEntity> => {
        let book: BookEntity | null;
        try {
            book = await this.bookRepository.findOne({
                where: { id },
                relations: ['createdBy', 'modifications', 'volumes'],
            });
        } catch (error) {
            throw handleDatabaseError(error, this.logger);
        }

        if (!book) {
            throw new NotFoundException(`Libro con ID "${id}" no encontrado.`);
        }
        return book;
    };

    update = async (
        id: string,
        updateDto: UpdateBookDto,
        userId: string,
    ): Promise<BookEntity> => {
        try {
            const modifier = await this.userService.findOneById(userId);
            const book = await this.bookRepository.preload({
                id,
                ...updateDto,
            });

            if (!book) {
                throw new NotFoundException(`Libro con ID "${id}" no encontrado.`);
            }

            const savedBook = await this.bookRepository.save(book);
            const newModification = this.modificationRepository.create({
                book: savedBook,
                modifier: modifier,
            });

            await this.modificationRepository.save(newModification);

            return savedBook;
        } catch (error) {
            throw handleDatabaseError(error, this.logger);
        }
    };

    remove = async (id: string): Promise<void> => {
        try {
            const result = await this.bookRepository.delete(id);
            if (result.affected === 0) {
                throw new NotFoundException(`Libro con ID "${id}" no encontrado.`);
            }
        } catch (error) {
            throw handleDatabaseError(error, this.logger);
        }
    };

    updateStatus = async (
        id: string,
        status: BookState,
        userId: string,
    ): Promise<BookEntity> => {
        try {
            const [modifier, book] = await Promise.all([
                this.userService.findOneById(userId),
                this.findOneById(id),
            ]);
            book.status = status;
            const savedBook = await this.bookRepository.save(book);

            const newModification = this.modificationRepository.create({
                book: savedBook,
                modifier: modifier,
            });
            await this.modificationRepository.save(newModification);

            return savedBook;
        } catch (error) {
            throw handleDatabaseError(error, this.logger);
        }
    };

    findAllForManagement = async (): Promise<GetBookManagementDto[]> => {
        try {
            const query = this.bookRepository.createQueryBuilder('book');

            query.select([
                'book.id AS id',
                'book.name AS name',
                'book.status AS status',
                'book.authorizationDate AS authorizationDate',
                'book.closingDate AS closingDate',
                'book.createdAt AS createdAt',
                'createdBy.nombre AS createdByName',
            ]);

            query.addSelect(
                (subQuery) => subQuery
                    .select('COUNT(DISTINCT vol.id)')
                    .from('tomos', 'vol') //
                    .where('vol.book_id = book.id'),
                'volumeCount'
            );

            query.addSelect(
                (subQuery) => subQuery
                    .select('COUNT(DISTINCT min.id)')
                    .from('tomos', 'vol')
                    .leftJoin('actas', 'min', 'min.volume_id = vol.id') //
                    .where('vol.book_id = book.id'),
                'minutesCount'
            );

            query.addSelect(
                (subQuery) => subQuery
                    .select('COUNT(DISTINCT agr.id)')
                    .from('tomos', 'vol')
                    .leftJoin('actas', 'min', 'min.volume_id = vol.id')
                    .leftJoin('acuerdos', 'agr', 'agr.minutesId = min.id') //
                    .where('vol.book_id = book.id'),
                'agreementCount'
            );

            query.addSelect(
                (subQuery) => subQuery
                    .select('MAX(mod.modification_date)')
                    .from('book_modifications', 'mod') //
                    .where('mod.book_id = book.id'),
                'latestModificationDate'
            );

            query.addSelect(
                (subQuery) => subQuery
                    .select('user.nombre')
                    .from('book_modifications', 'mod')
                    .leftJoin('usuarios', 'user', 'user.id = mod.user_id') //
                    .where('mod.book_id = book.id')
                    .orderBy('mod.modification_date', 'DESC')
                    .limit(1),
                'latestModifierName'
            );

            query.leftJoin('book.createdBy', 'createdBy');

            query.groupBy(
                'book.id, book.name, book.status, book.authorizationDate, book.closingDate, book.createdAt, createdBy.nombre'
            );

            query.orderBy('book.createdAt', 'DESC');

            const results = await query.getRawMany();

            return results.map(r => ({
                ...r,
                volumeCount: parseInt(r.volumeCount, 10) || 0,
                minutesCount: parseInt(r.minutesCount, 10) || 0,
                agreementCount: parseInt(r.agreementCount, 10) || 0,
            }));

        } catch (error) {
            throw handleDatabaseError(error, this.logger); //
        }
    };

    findAllAgreementsContentByBookId = async (id: string): Promise<GetBookAgreementsContentDto> => {
        try {
            const book = await this.bookRepository.findOne({
                where: { id },
                select: ['id', 'name'],
            });

            if (!book) {
                throw new NotFoundException(`Libro con ID "${id}" no encontrado.`);
            }

            const results = await this.bookRepository.createQueryBuilder('book')
                .leftJoin('book.volumes', 'volume')
                .leftJoin('volume.minutes', 'minutes')
                .leftJoin('minutes.agreements', 'agreement')
                .select('agreement.content', 'content')
                .where('book.id = :id', { id })
                .andWhere('agreement.content IS NOT NULL')
                .getRawMany<AgreementContentRawResult>();

            const contents: string[] = results.map(r => r.content);

            return {
                bookId: book.id,
                bookName: book.name,
                agreementContents: contents,
            };

        } catch (error) {
            throw handleDatabaseError(error, this.logger);
        }
    };
}
