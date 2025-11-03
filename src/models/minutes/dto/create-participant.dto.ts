import { IsString, IsNotEmpty, IsBoolean, IsOptional } from 'class-validator';

export class CreateParticipantDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsBoolean()
  @IsOptional()
  isSubstitute?: boolean;
}