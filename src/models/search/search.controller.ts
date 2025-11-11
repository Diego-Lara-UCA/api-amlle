import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { SearchService } from './search.service';
import { Roles } from 'src/common/utils/decorators/roles.decorator';
import { Role } from 'src/models/user/enums/role.enum';
import { SearchResponseDto } from './dto/search-response.dto';
import { SearchQueryDto } from './dto/search-query.dto';

@Controller('api/search')
export class SearchController {
    constructor(private readonly searchService: SearchService) { }

    @Get()
    @Roles(Role.REGULAR, Role.ADMIN, Role.SUPERADMIN)
    search(@Query() query: SearchQueryDto): Promise<SearchResponseDto> { // 👈 Usar el DTO
        return this.searchService.search(query);
    }
}
