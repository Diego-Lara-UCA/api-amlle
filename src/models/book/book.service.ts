import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BookEntity } from './entities/book.entity';
import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { CreateBookDto } from './dto/create-book.dto';
import { handleDatabaseError } from 'src/common/utils/error-handler.util';
import { UpdateBookDto } from './dto/update-book.dto';
import { BookState } from './enums/book-state.enum';

@Injectable()
export class BookService {
    private readonly logger = new Logger('BooksService');

    constructor(
        @InjectRepository(BookEntity)
        private readonly bookRepository: Repository<BookEntity>,
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
                relations: ['createdBy', 'modifiedBy'],
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
                relations: ['createdBy', 'modifiedBy', 'volumes'],
            });
        } catch (error) {
            throw handleDatabaseError(error, this.logger);
        }

        if (!book) {
            throw new NotFoundException(`Libro con ID "${id}" no encontrado.`);
        }
        return book;
    };

    update = async (id: string, updateBookDto: UpdateBookDto, userId: string): Promise<BookEntity> => {
        try {
            const modifier = await this.userService.findOneById(userId);
            const book = await this.bookRepository.preload({
                id,
                ...updateBookDto,
            });

            if (!book) {
                throw new NotFoundException(`Libro con ID "${id}" no encontrado.`);
            }

            book.modifiedBy = modifier;

            return await this.bookRepository.save(book);
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

    updateStatus = async (id: string, status: BookState, userId: string): Promise<BookEntity> => {
    try {
      const modifier = await this.userService.findOneById(userId);
      const book = await this.findOneById(id);

      book.status = status;
      book.modifiedBy = modifier;
      
      return await this.bookRepository.save(book);
    } catch (error) {
      throw handleDatabaseError(error, this.logger);
    }
  };
}
