import { IsUUID, IsNotEmpty } from 'class-validator';

export class AssignSubstitutoDto {
  @IsNotEmpty()
  substitutoId: string;
}