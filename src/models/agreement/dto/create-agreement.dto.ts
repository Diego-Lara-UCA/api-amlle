import { IsString, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class CreateAgreementDto {
  @IsNotEmpty()
  minutesId: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  agreementNumber: number;

  @IsString()
  @IsOptional()
  content?: string;
}