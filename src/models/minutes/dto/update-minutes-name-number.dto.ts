import { IsString, IsNotEmpty, IsInt, IsPositive } from 'class-validator';

export class UpdateMinutesNameNumberDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsInt()
  @IsPositive()
  actNumber: number;
}