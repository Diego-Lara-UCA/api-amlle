import { GetAgreementResponseDto } from 'src/models/agreement/dto/get-agreement-response.dto';
import { GetBookResponseDto } from 'src/models/book/dto/get-book-response.dto';
import { GetMinutesResponseDto } from 'src/models/minutes/dto/get-minutes-response.dto';
import { GetVolumeResponseDto } from 'src/models/volume/dto/get-volume-response.dto';

export class SearchResponseDto {
  books: GetBookResponseDto[];
  volumes: GetVolumeResponseDto[];
  minutes: GetMinutesResponseDto[];
  agreements: GetAgreementResponseDto[];
}
