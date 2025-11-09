import { IsString, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class CreateAgreementDto {
  @IsUUID()
  @IsNotEmpty()
  minutesId: string;

  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  content?: string;
}