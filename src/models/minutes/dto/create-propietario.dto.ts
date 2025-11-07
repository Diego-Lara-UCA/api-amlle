import { IsString, IsNotEmpty } from 'class-validator';

export class CreatePropietarioDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}