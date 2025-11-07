import { PartialType } from '@nestjs/mapped-types';
import { CreateSubstitutoDto } from './create-substituto.dto';

export class UpdateSubstitutoDto extends PartialType(CreateSubstitutoDto) {}