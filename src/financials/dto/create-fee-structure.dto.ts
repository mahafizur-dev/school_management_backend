import { IsString, IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class CreateFeeStructureDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsPositive()
  amount: number;

  @IsString()
  @IsNotEmpty()
  description: string;
}
