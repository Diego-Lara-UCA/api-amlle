import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { BookEntity } from '../book/entities/book.entity';
import { VolumeEntity } from '../volume/entities/volume.entity';
import { MinutesEntity } from '../minutes/entities/minute.entity';
import { AgreementEntity } from '../agreement/entities/agreement.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BookEntity,
      VolumeEntity,
      MinutesEntity,
      AgreementEntity
    ]),
  ],
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule {}
