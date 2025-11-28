import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { SubstitutoType } from '../enums/substituto.entity';

export class CreateSubstitutoDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(SubstitutoType)
  @IsNotEmpty()
  type: SubstitutoType;
}