import { IsUUID, IsNotEmpty } from 'class-validator';

export class AssignSubstitutoDto {
  @IsUUID()
  @IsNotEmpty()
  substitutoId: string;
}