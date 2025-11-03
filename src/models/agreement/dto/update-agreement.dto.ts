import { IsString, IsOptional } from 'class-validator';

export class UpdateAgreementDto {
  @IsString()
  @IsOptional()
  content?: string;
}