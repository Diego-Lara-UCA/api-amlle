import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { entities } from 'src/models';

@Module({
  imports: [
    TypeOrmModule.forFeature(entities),
  ],
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule {}
