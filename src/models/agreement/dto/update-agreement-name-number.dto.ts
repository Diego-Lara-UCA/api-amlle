import { IsString, IsNotEmpty, IsInt, IsPositive } from 'class-validator';

export class UpdateAgreementNameNumberDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsInt()
  @IsPositive()
  agreementNumber: number;
}
