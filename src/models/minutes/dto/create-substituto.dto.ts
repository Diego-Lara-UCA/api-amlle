import { IsString, IsNotEmpty } from 'class-validator';

export class CreateSubstitutoDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}