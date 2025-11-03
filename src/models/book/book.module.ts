import { BookService } from './book.service';
import { BookController } from './book.controller';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookEntity } from './entities/book.entity';
import { UserModule } from '../user/user.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([BookEntity]),
        UserModule
    ],
    controllers: [
        BookController,
    ],
    providers: [
        BookService,
    ],
    exports: [
        BookService
    ]
})

export class BookModule { }
