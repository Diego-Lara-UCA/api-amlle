import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    ParseUUIDPipe,
    Request,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { BookService } from './book.service';
import { Roles } from 'src/common/utils/decorators/roles.decorator';
import { Role } from '../user/enums/role.enum';
import { CreateBookDto } from './dto/create-book.dto';
import { User } from 'src/common/utils/decorators/user.decorator';
import { UpdateBookDto } from './dto/update-book.dto';
import { UpdateBookStatusDto } from './dto/update-book-status.dto';

@Controller("api/book")
export class BookController {
    constructor(
        private readonly booksService: BookService
    ) { }

    @Post("create")
    @Roles(Role.SUPERADMIN, Role.ADMIN, Role.REGULAR)
    create(@Body() createBookDto: CreateBookDto, @User('userId') userId: string) {
        return this.booksService.create(createBookDto, userId);
    };

    @Get("all")
    @Roles(Role.SUPERADMIN, Role.ADMIN, Role.REGULAR)
    findAll() {
        return this.booksService.findAll();
    }

    @Get('find/:id')
    @Roles(Role.SUPERADMIN, Role.ADMIN, Role.REGULAR)
    findOne(@Param('id', ParseUUIDPipe) id: string) {
        return this.booksService.findOneById(id);
    }

    @Patch('update/:id')
    @Roles(Role.SUPERADMIN, Role.ADMIN, Role.REGULAR)
    update(@Param('id', ParseUUIDPipe) id: string, @Body() updateBookDto: UpdateBookDto, @User('userId') userId: string) {
        return this.booksService.update(id, updateBookDto, userId);
    }

    @Delete('delete/:id')
    @Roles(Role.SUPERADMIN, Role.ADMIN, Role.REGULAR)
    @HttpCode(HttpStatus.NO_CONTENT)
    remove(@Param('id', ParseUUIDPipe) id: string) {
        return this.booksService.remove(id);
    }

    @Patch('update-status/:id')
    @Roles(Role.SUPERADMIN, Role.ADMIN, Role.REGULAR)
    updateStatus(@Param('id', ParseUUIDPipe) id: string, @Body() updateBookStatusDto: UpdateBookStatusDto, @User('userId') userId: string) {
        return this.booksService.updateStatus(id, updateBookStatusDto.status, userId);
    }
} 
